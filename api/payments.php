<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

function get_active_plan_tier(PDO $pdo, int $freelancerId): string {
  try {
    $stmt = $pdo->prepare("SELECT tipo_plano FROM plans WHERE freelancer_id = ? AND status = 'active' ORDER BY inicio DESC LIMIT 1");
    $stmt->execute([$freelancerId]);
    $row = $stmt->fetch();
    return $row ? (string)$row['tipo_plano'] : 'basic';
  } catch (Throwable $e) {
    return 'basic';
  }
}

function get_fee_rate_by_plan(string $tier): float {
  if ($tier === 'premium') return 0.10;
  if ($tier === 'pro') return 0.15;
  return 0.20;
}

try {
  $pdo = db_get_pdo();
  $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
  if ($method !== 'POST') {
    json_response(['ok' => false, 'error' => 'Método não permitido'], 405);
    exit;
  }
  $raw = file_get_contents('php://input');
  $data = json_decode($raw ?: '{}', true);
  if (!is_array($data)) $data = [];
  $action = $data['action'] ?? ($_GET['action'] ?? ($_POST['action'] ?? ''));

  if ($action === 'create_checkout' || $action === 'create_escrow') {
    $projectId = isset($data['projectId']) ? (int)$data['projectId'] : 0;
    $amount = isset($data['amount']) ? (float)$data['amount'] : 0.0;
    $methodPay = $data['method'] ?? 'pix';
    if ($projectId <= 0 || $amount <= 0) {
      json_response(['ok' => false, 'error' => 'Dados inválidos'], 400); exit;
    }
    $pdo->prepare("INSERT INTO payments (project_id, valor, metodo, gateway, status, created_at) VALUES (?, ?, ?, ?, 'Created', NOW())")
        ->execute([$projectId, $amount, $methodPay, 'internal']);
    $pid = (int)$pdo->lastInsertId();
    $pdo->prepare("INSERT INTO payments_ledger (payment_id, project_id, tipo, valor) VALUES (?, ?, 'Deposit', ?)")->execute([$pid, $projectId, $amount]);
    json_response(['ok' => true, 'paymentId' => $pid, 'checkoutUrl' => null]);
    exit;
  }

  if ($action === 'confirm_payment') {
    $paymentId = isset($data['paymentId']) ? (int)$data['paymentId'] : 0;
    if ($paymentId <= 0) { json_response(['ok' => false, 'error' => 'Pagamento inválido'], 400); exit; }
    $pdo->prepare("UPDATE payments SET status = 'Confirmed', confirmed_at = NOW() WHERE id = ?")->execute([$paymentId]);
    $stmt = $pdo->prepare("SELECT project_id, valor FROM payments WHERE id = ?");
    $stmt->execute([$paymentId]);
    $p = $stmt->fetch();
    if ($p) {
      $pdo->prepare("INSERT INTO payments_ledger (payment_id, project_id, tipo, valor) VALUES (?, ?, 'Hold', ?)")->execute([$paymentId, (int)$p['project_id'], (float)$p['valor']]);
      $pdo->prepare("UPDATE projects SET status = 'In_Progress' WHERE id = ?")->execute([(int)$p['project_id']]);
    }
    json_response(['ok' => true]);
    exit;
  }

  if ($action === 'release_payment') {
    $paymentId = isset($data['paymentId']) ? (int)$data['paymentId'] : 0;
    if ($paymentId <= 0) { json_response(['ok' => false, 'error' => 'Pagamento inválido'], 400); exit; }
    $stmt = $pdo->prepare("SELECT p.project_id, p.valor FROM payments p WHERE p.id = ?");
    $stmt->execute([$paymentId]);
    $pay = $stmt->fetch();
    if (!$pay) { json_response(['ok' => false, 'error' => 'Pagamento não encontrado'], 404); exit; }
    $projectId = (int)$pay['project_id'];
    $amount = (float)$pay['valor'];
    // Descobrir freelancer aceito
    $freelancerId = null;
    try {
      $st = $pdo->prepare("SELECT freelancer_id FROM proposals WHERE project_id = ? AND status = 'Accepted' ORDER BY id DESC LIMIT 1");
      $st->execute([$projectId]);
      $row = $st->fetch();
      if ($row) $freelancerId = (int)$row['freelancer_id'];
    } catch (Throwable $e) {}
    // Taxa por plano com piso R$10
    $tier = $freelancerId ? get_active_plan_tier($pdo, $freelancerId) : 'basic';
    $rate = get_fee_rate_by_plan($tier);
    $fee = max(10.0, round($amount * $rate, 2));
    $payout = max(0.0, $amount - $fee);
    // Ledger
    $pdo->prepare("INSERT INTO payments_ledger (payment_id, project_id, user_id, tipo, valor) VALUES (?, ?, NULL, 'Fee', ?)")
        ->execute([$paymentId, $projectId, $fee]);
    $pdo->prepare("INSERT INTO payments_ledger (payment_id, project_id, user_id, tipo, valor) VALUES (?, ?, ?, 'Payout', ?)")
        ->execute([$paymentId, $projectId, $freelancerId, $payout]);
    $pdo->prepare("UPDATE payments SET status = 'Released', released_at = NOW() WHERE id = ?")->execute([$paymentId]);
    // Projeto vai para Awaiting_Release -> Closed. Aqui consideramos liberação final pelo cliente:
    $pdo->prepare("UPDATE projects SET status = 'Closed', closed_at = NOW() WHERE id = ?")->execute([$projectId]);
    json_response(['ok' => true, 'fee' => $fee, 'payout' => $payout, 'plan' => $tier]);
    exit;
  }

  if ($action === 'refund_payment') {
    $paymentId = isset($data['paymentId']) ? (int)$data['paymentId'] : 0;
    $amount = isset($data['amount']) ? (float)$data['amount'] : 0.0; // 0 => total
    if ($paymentId <= 0) { json_response(['ok' => false, 'error' => 'Pagamento inválido'], 400); exit; }
    $stmt = $pdo->prepare("SELECT project_id, valor FROM payments WHERE id = ?");
    $stmt->execute([$paymentId]);
    $p = $stmt->fetch();
    if (!$p) { json_response(['ok' => false, 'error' => 'Pagamento não encontrado'], 404); exit; }
    $total = (float)$p['valor'];
    $refundValue = $amount > 0 ? min($amount, $total) : $total;
    $pdo->prepare("INSERT INTO payments_ledger (payment_id, project_id, tipo, valor) VALUES (?, ?, 'Refund', ?)")->execute([$paymentId, (int)$p['project_id'], $refundValue]);
    $pdo->prepare("UPDATE payments SET status = 'Refunded', refunded_at = NOW() WHERE id = ?")->execute([$paymentId]);
    $pdo->prepare("UPDATE projects SET status = 'Closed', closed_at = NOW() WHERE id = ?")->execute([(int)$p['project_id']]);
    json_response(['ok' => true, 'refunded' => $refundValue]);
    exit;
  }

  if ($action === 'create_subscription_intent') {
    try {
      $secret = 'demo_' . bin2hex(random_bytes(12));
      json_response(['ok' => true, 'clientSecret' => $secret]);
    } catch (Throwable $e) {
      json_response(['ok' => false, 'error' => 'internal'], 500);
    }
    exit;
  }

  json_response(['ok' => false, 'error' => 'invalid_action'], 400);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'server_error'], 500);
}

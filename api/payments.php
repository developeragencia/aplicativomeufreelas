<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

function notify_user(PDO $pdo, int $userId, string $type, string $title, string $desc, ?string $link = null): void {
  try {
    $pdo->prepare("INSERT INTO notifications (user_id, tipo, titulo, descricao, link) VALUES (?, ?, ?, ?, ?)")
        ->execute([$userId, $type, $title, $desc, $link]);
  } catch (Throwable $e) { /* noop */ }
}

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

  if ($action === 'list_payments') {
    $userId = isset($data['userId']) ? (int)$data['userId'] : 0;
    $userType = $data['userType'] ?? 'client';
    if ($userId <= 0) { json_response(['ok' => false, 'error' => 'Usuário inválido'], 400); exit; }

    $balance = 0.0;
    $pending = 0.0;
    $monthTotal = 0.0;
    $transactions = [];

    if ($userType === 'freelancer') {
        $stmt = $pdo->prepare("SELECT SUM(valor) FROM payments_ledger WHERE user_id = ? AND tipo = 'Payout'");
        $stmt->execute([$userId]);
        $balance = (float)$stmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT SUM(p.valor) FROM payments p JOIN proposals prop ON p.project_id = prop.project_id WHERE prop.freelancer_id = ? AND prop.status = 'Accepted' AND p.status = 'Confirmed'");
        $stmt->execute([$userId]);
        $pending = (float)$stmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT SUM(valor) FROM payments_ledger WHERE user_id = ? AND tipo = 'Payout' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $stmt->execute([$userId]);
        $monthTotal = (float)$stmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT l.id, l.valor, l.created_at, l.tipo, p.titulo as project_title FROM payments_ledger l LEFT JOIN projects p ON l.project_id = p.id WHERE l.user_id = ? AND l.tipo = 'Payout' ORDER BY l.created_at DESC LIMIT 50");
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $r) {
            $transactions[] = [
                'id' => $r['id'],
                'description' => 'Pagamento recebido',
                'amount' => 'R$ ' . number_format((float)$r['valor'], 2, ',', '.'),
                'type' => 'entrada',
                'status' => 'Concluído',
                'date' => date('d/m/Y', strtotime($r['created_at'])),
                'project' => $r['project_title']
            ];
        }
    } else {
        $stmt = $pdo->prepare("SELECT SUM(p.valor) FROM payments p JOIN projects proj ON p.project_id = proj.id WHERE proj.cliente_id = ? AND p.status = 'Confirmed'");
        $stmt->execute([$userId]);
        $pending = (float)$stmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT SUM(p.valor) FROM payments p JOIN projects proj ON p.project_id = proj.id WHERE proj.cliente_id = ? AND p.status = 'Released' AND p.released_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $stmt->execute([$userId]);
        $monthTotal = (float)$stmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT p.id, p.valor, p.created_at, p.status, proj.titulo as project_title FROM payments p JOIN projects proj ON p.project_id = proj.id WHERE proj.cliente_id = ? ORDER BY p.created_at DESC LIMIT 50");
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $r) {
            $transactions[] = [
                'id' => $r['id'],
                'description' => 'Pagamento de projeto',
                'amount' => 'R$ ' . number_format((float)$r['valor'], 2, ',', '.'),
                'type' => 'saida',
                'rawStatus' => strtolower($r['status']),
                'status' => $r['status'] === 'Released' ? 'Concluído' : ($r['status'] === 'Confirmed' ? 'Pendente' : 'Em processamento'),
                'date' => date('d/m/Y', strtotime($r['created_at'])),
                'project' => $r['project_title']
            ];
        }
    }

    json_response([
        'ok' => true,
        'summary' => [
            'balance' => 'R$ ' . number_format($balance, 2, ',', '.'),
            'pending' => 'R$ ' . number_format($pending, 2, ',', '.'),
            'monthReceived' => 'R$ ' . number_format($monthTotal, 2, ',', '.')
        ],
        'transactions' => $transactions
    ]);
    exit;
  }

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
      // Notify client and accepted freelancer if exists
      $projId = (int)$p['project_id'];
      $clientId = 0; $freelancerId = 0;
      try {
        $q = $pdo->prepare("SELECT cliente_id FROM projects WHERE id = ? LIMIT 1");
        $q->execute([$projId]);
        $row = $q->fetch(); if ($row) $clientId = (int)$row['cliente_id'];
        $q2 = $pdo->prepare("SELECT freelancer_id FROM proposals WHERE project_id = ? AND status = 'Accepted' ORDER BY id DESC LIMIT 1");
        $q2->execute([$projId]); $r2 = $q2->fetch(); if ($r2) $freelancerId = (int)$r2['freelancer_id'];
      } catch (Throwable $e) {}
      if ($clientId > 0) notify_user($pdo, $clientId, 'payment', 'Pagamento confirmado', 'O depósito do projeto foi confirmado e o trabalho pode iniciar.', "/project/{$projId}");
      if ($freelancerId > 0) notify_user($pdo, $freelancerId, 'payment', 'Depósito confirmado', 'O cliente confirmou o depósito do projeto. Você já pode começar.', "/project/{$projId}");
    }
    json_response(['ok' => true]);
    exit;
  }

  if ($action === 'release_payment') {
    $paymentId = isset($data['paymentId']) ? (int)$data['paymentId'] : 0;
    $projectIdParam = isset($data['projectId']) ? (int)$data['projectId'] : 0;
    if ($paymentId <= 0 && $projectIdParam <= 0) { json_response(['ok' => false, 'error' => 'Requisição inválida'], 400); exit; }
    if ($paymentId > 0) {
      $stmt = $pdo->prepare("SELECT p.project_id, p.valor FROM payments p WHERE p.id = ?");
      $stmt->execute([$paymentId]);
    } else {
      // Obter último pagamento confirmado do projeto
      $stmt = $pdo->prepare("SELECT p.id, p.project_id, p.valor FROM payments p WHERE p.project_id = ? AND p.status IN ('Confirmed','Created') ORDER BY p.id DESC LIMIT 1");
      $stmt->execute([$projectIdParam]);
      $row = $stmt->fetch();
      if ($row) $paymentId = (int)$row['id'];
    }
    $pay = isset($row) && $row ? $row : ($stmt->fetch() ?: null);
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
    // Notify both
    try {
      $owner = $pdo->prepare("SELECT cliente_id FROM projects WHERE id = ? LIMIT 1");
      $owner->execute([$projectId]);
      $ownerId = (int)($owner->fetch()['cliente_id'] ?? 0);
      if ($ownerId > 0) notify_user($pdo, $ownerId, 'payment', 'Pagamento liberado', 'Você liberou o pagamento ao freelancer.', "/project/{$projectId}");
      if ($freelancerId > 0) notify_user($pdo, $freelancerId, 'payment', 'Pagamento recebido', 'O cliente liberou o pagamento. Parabéns!', "/project/{$projectId}");
    } catch (Throwable $e) {}
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
    // Notify
    try {
      $projId = (int)$p['project_id'];
      $owner = $pdo->prepare("SELECT cliente_id FROM projects WHERE id = ? LIMIT 1");
      $owner->execute([$projId]);
      $ownerId = (int)($owner->fetch()['cliente_id'] ?? 0);
      $q2 = $pdo->prepare("SELECT freelancer_id FROM proposals WHERE project_id = ? AND status = 'Accepted' ORDER BY id DESC LIMIT 1");
      $q2->execute([$projId]); $r2 = $q2->fetch(); $freelancerId = $r2 ? (int)$r2['freelancer_id'] : 0;
      if ($ownerId > 0) notify_user($pdo, $ownerId, 'payment', 'Pagamento reembolsado', 'Você efetuou um reembolso do projeto.', "/project/{$projId}");
      if ($freelancerId > 0) notify_user($pdo, $freelancerId, 'payment', 'Pagamento reembolsado', 'O cliente realizou um reembolso deste projeto.', "/project/{$projId}");
    } catch (Throwable $e) {}
    json_response(['ok' => true, 'refunded' => $refundValue]);
    exit;
  }

  if ($action === 'create_subscription_checkout') {
    $userId = isset($data['userId']) ? (int)$data['userId'] : 0;
    $plan = $data['plan'] ?? '';
    $cycle = $data['cycle'] ?? 'monthly';

    if ($userId <= 0 || !in_array($plan, ['pro', 'premium'])) {
        json_response(['ok' => false, 'error' => 'Dados inválidos'], 400);
        exit;
    }

    // Demo: Immediate success
    $days = $cycle === 'yearly' ? 365 : 30;
    $expiresAt = date('Y-m-d H:i:s', strtotime("+$days days"));
    
    // Update user
    $stmt = $pdo->prepare("UPDATE users SET is_premium = 1, plan = ?, plan_expires_at = ? WHERE id = ?");
    $stmt->execute([$plan, $expiresAt, $userId]);
    
    // Log transaction (ledger)
    $amount = ($plan === 'pro') ? 59.90 : 99.90;
    if ($cycle === 'yearly') $amount *= 10; // discount

    // Ensure ledger accepts NULL project_id, if not use 0
    // Try catch to be safe
    try {
        $stmt = $pdo->prepare("INSERT INTO payments_ledger (user_id, project_id, tipo, valor, created_at) VALUES (?, NULL, 'Subscription', ?, NOW())");
        $stmt->execute([$userId, $amount]);
    } catch (Throwable $e) {
        // If fails, maybe project_id cannot be null? Try 0? Or ignore log
    }

    json_response(['ok' => true]);
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

<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
  json_response(['ok' => false, 'error' => 'Método não permitido'], 405);
  exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!is_array($data)) $data = $_POST;
$action = $data['action'] ?? null;

function load_user_payload(PDO $pdo, int $userId): array {
  $stmt = $pdo->prepare('SELECT id, email, role, active_role FROM users WHERE id = ? LIMIT 1');
  $stmt->execute([$userId]);
  $u = $stmt->fetch();
  if (!$u) return [];
  $hasClient = false;
  $hasFreelancer = false;
  $stmt2 = $pdo->prepare('SELECT role FROM user_accounts WHERE user_id = ?');
  $stmt2->execute([$userId]);
  foreach ($stmt2->fetchAll() as $r) {
    if ($r['role'] === 'client') $hasClient = true;
    if ($r['role'] === 'freelancer') $hasFreelancer = true;
  }
  $name = $u['email'];
  $active = $u['active_role'] ?: $u['role'];
  if ($active === 'client') {
    $stmt3 = $pdo->prepare('SELECT nome FROM profiles_cliente WHERE user_id = ? LIMIT 1');
    $stmt3->execute([$userId]);
    $p = $stmt3->fetch();
    if ($p && !empty($p['nome'])) $name = $p['nome'];
  } else {
    $stmt3 = $pdo->prepare('SELECT titulo FROM profiles_freelancer WHERE user_id = ? LIMIT 1');
    $stmt3->execute([$userId]);
    $p = $stmt3->fetch();
    if ($p && !empty($p['titulo'])) $name = $p['titulo'];
  }
  return [
    'id' => (int)$u['id'],
    'email' => $u['email'],
    'name' => $name,
    'type' => $active,
    'hasClientAccount' => $hasClient,
    'hasFreelancerAccount' => $hasFreelancer,
  ];
}

try {
  $pdo = db_get_pdo();
  if ($action === 'switch_account_type') {
    $userId = $data['userId'] ?? null;
    $targetType = $data['targetType'] ?? null;
    if (!is_numeric($userId) || !in_array($targetType, ['client','freelancer'], true)) {
      json_response(['ok' => false, 'error' => 'Dados inválidos'], 400);
      exit;
    }
    $stmt = $pdo->prepare('SELECT 1 FROM user_accounts WHERE user_id = ? AND role = ?');
    $stmt->execute([(int)$userId, $targetType]);
    if (!$stmt->fetch()) {
      json_response(['ok' => false, 'error' => 'Conta não existente para o tipo solicitado', 'code' => 'NO_ACCOUNT'], 404);
      exit;
    }
    $pdo->prepare('UPDATE users SET active_role = ? WHERE id = ?')->execute([$targetType, (int)$userId]);
    $user = load_user_payload($pdo, (int)$userId);
    json_response(['ok' => true, 'user' => $user]);
    exit;
  } elseif ($action === 'create_secondary_account') {
    $userId = $data['userId'] ?? null;
    $accountType = $data['accountType'] ?? null;
    if (!is_numeric($userId) || !in_array($accountType, ['client','freelancer'], true)) {
      json_response(['ok' => false, 'error' => 'Dados inválidos'], 400);
      exit;
    }
    $stmt = $pdo->prepare('SELECT 1 FROM user_accounts WHERE user_id = ? AND role = ?');
    $stmt->execute([(int)$userId, $accountType]);
    if ($stmt->fetch()) {
      json_response(['ok' => true, 'user' => load_user_payload($pdo, (int)$userId)]);
      exit;
    }
    $pdo->prepare('INSERT INTO user_accounts (user_id, role) VALUES (?, ?)')->execute([(int)$userId, $accountType]);
    if ($accountType === 'client') {
      $stmt2 = $pdo->prepare('SELECT 1 FROM profiles_cliente WHERE user_id = ?');
      $stmt2->execute([(int)$userId]);
      if (!$stmt2->fetch()) {
        $pdo->prepare('INSERT INTO profiles_cliente (user_id, nome) VALUES (?, ?)')->execute([(int)$userId, '']);
      }
    } else {
      $stmt2 = $pdo->prepare('SELECT 1 FROM profiles_freelancer WHERE user_id = ?');
      $stmt2->execute([(int)$userId]);
      if (!$stmt2->fetch()) {
        $pdo->prepare('INSERT INTO profiles_freelancer (user_id, titulo, bio) VALUES (?, ?, ?)')->execute([(int)$userId, '', '']);
        $pdo->prepare('INSERT INTO connections_wallet (freelancer_id, saldo_plano_mensal, saldo_medalha_bonus, saldo_nao_expiravel) VALUES (?, 0, 0, 0)')->execute([(int)$userId]);
        $pdo->prepare('INSERT INTO plans (freelancer_id, tipo_plano, modalidade, inicio, status) VALUES (?, ?, ?, ?, ?)')->execute([(int)$userId, 'basic', 'compra', date('Y-m-d'), 'active']);
      }
    }
    $pdo->prepare('UPDATE users SET active_role = ? WHERE id = ?')->execute([$accountType, (int)$userId]);
    $user = load_user_payload($pdo, (int)$userId);
    json_response(['ok' => true, 'user' => $user]);
    exit;
  } else {
    json_response(['ok' => false, 'error' => 'Ação inválida'], 400);
    exit;
  }
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha de conexão com o servidor'], 500);
}

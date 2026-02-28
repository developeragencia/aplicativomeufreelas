<?php
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
  json_response(['ok' => false, 'error' => 'Método não permitido'], 405);
  exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!is_array($data)) $data = $_POST;

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
if (!is_string($email) || !is_string($password)) {
  json_response(['ok' => false, 'error' => 'Dados inválidos'], 400);
  exit;
}

try {
  $pdo = db_get_pdo();
  $stmt = $pdo->prepare('SELECT id, role, email, password_hash, active_role FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $row = $stmt->fetch();
  if (!$row) {
    json_response(['ok' => false, 'error' => 'Email ou senha incorretos.', 'code' => 'INVALID_CREDENTIALS'], 401);
    exit;
  }
  if (!password_verify($password, $row['password_hash'])) {
    json_response(['ok' => false, 'error' => 'Email ou senha incorretos.', 'code' => 'INVALID_CREDENTIALS'], 401);
    exit;
  }
  $pdo->prepare('UPDATE users SET last_login_at = NOW() WHERE id = ?')->execute([$row['id']]);
  // Tipo ativo baseado em active_role ou primeira conta existente
  $active = $row['active_role'] ?: $row['role'];
  $name = $row['email'];
  if ($active === 'client') {
    $stmt2 = $pdo->prepare('SELECT nome FROM profiles_cliente WHERE user_id = ? LIMIT 1');
    $stmt2->execute([$row['id']]);
    $p = $stmt2->fetch();
    if ($p && !empty($p['nome'])) $name = $p['nome'];
  } else {
    $stmt2 = $pdo->prepare('SELECT titulo FROM profiles_freelancer WHERE user_id = ? LIMIT 1');
    $stmt2->execute([$row['id']]);
    $p = $stmt2->fetch();
    if ($p && !empty($p['titulo'])) $name = $p['titulo'];
  }
  // flags de contas
  $hasClient = false; $hasFreelancer = false;
  $stmt4 = $pdo->prepare('SELECT role FROM user_accounts WHERE user_id = ?');
  $stmt4->execute([$row['id']]);
  foreach ($stmt4->fetchAll() as $r) {
    if ($r['role'] === 'client') $hasClient = true;
    if ($r['role'] === 'freelancer') $hasFreelancer = true;
  }
  json_response(['ok' => true, 'user' => ['id' => (int)$row['id'], 'email' => $row['email'], 'name' => $name, 'type' => $active, 'hasClientAccount' => $hasClient, 'hasFreelancerAccount' => $hasFreelancer]]);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha de conexão com o servidor'], 500);
}

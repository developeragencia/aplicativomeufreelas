<?php
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
  json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
  exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!is_array($data)) $data = $_POST;

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
if (!is_string($email) || !is_string($password)) {
  json_response(['ok' => false, 'error' => 'Invalid payload'], 400);
  exit;
}

try {
  $pdo = db_get_pdo();
  $stmt = $pdo->prepare('SELECT id, role, email, password_hash FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $row = $stmt->fetch();
  if (!$row) {
    json_response(['ok' => false, 'error' => 'Invalid credentials'], 401);
    exit;
  }
  if (!password_verify($password, $row['password_hash'])) {
    json_response(['ok' => false, 'error' => 'Invalid credentials'], 401);
    exit;
  }
  $pdo->prepare('UPDATE users SET last_login_at = NOW() WHERE id = ?')->execute([$row['id']]);
  json_response(['ok' => true, 'user' => ['id' => (int)$row['id'], 'email' => $row['email'], 'name' => $row['email'], 'type' => $row['role']]]);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha de conexão com o servidor'], 500);
}

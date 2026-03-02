<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  json_response(['ok' => false, 'error' => 'Método não permitido'], 405);
  exit;
}

$token = isset($_GET['token']) ? (string)$_GET['token'] : '';
$tokenFile = __DIR__ . '/../.deploy_token';
if (!is_string($token) || $token === '' || !file_exists($tokenFile)) {
  json_response(['ok' => false, 'error' => 'Não autorizado'], 403); exit;
}
$serverToken = trim(file_get_contents($tokenFile));
if ($serverToken === '' || !hash_equals($serverToken, $token)) {
  json_response(['ok' => false, 'error' => 'Não autorizado'], 403); exit;
}

$input = json_decode(file_get_contents('php://input') ?: '{}', true);
if (!is_array($input)) $input = [];
$email = isset($input['email']) ? (string)$input['email'] : '';
$password = isset($input['password']) ? (string)$input['password'] : '';
$name = isset($input['name']) ? (string)$input['name'] : 'Administrador';
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
  json_response(['ok' => false, 'error' => 'Dados inválidos (email ou senha)'], 400); exit;
}

try {
  $pdo = db_get_pdo();
  $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $existingId = $stmt->fetchColumn();
  $hash = password_hash($password, PASSWORD_DEFAULT);
  if ($existingId) {
    $pdo->prepare('UPDATE users SET role = ?, password_hash = ?, status = ? WHERE id = ?')
        ->execute(['admin', $hash, 'active', (int)$existingId]);
    $id = (int)$existingId;
  } else {
    $pdo->prepare('INSERT INTO users (role, email, password_hash, status) VALUES (?, ?, ?, ?)')
        ->execute(['admin', $email, $hash, 'active']);
    $id = (int)$pdo->lastInsertId();
  }
  json_response(['ok' => true, 'id' => $id, 'email' => $email]);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha ao criar admin'], 500);
}

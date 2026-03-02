<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

function require_token(): void {
  $param = isset($_GET['token']) ? (string)$_GET['token'] : '';
  $envToken = env('DEPLOY_TOKEN', '');
  $file = __DIR__ . '/../.deploy_token';
  $fileToken = is_file($file) ? trim((string)@file_get_contents($file)) : '';
  $ok = ($envToken !== '' && hash_equals($envToken, $param)) || ($fileToken !== '' && hash_equals($fileToken, $param));
  if (!$ok) { json_response(['ok' => false, 'error' => 'unauthorized'], 403); exit; }
}

function ensure_users_table(PDO $pdo): void {
  $pdo->exec("CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    role ENUM('client','freelancer','admin') NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    active_role ENUM('client','freelancer') NULL,
    status ENUM('active','blocked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
}

try {
  require_token();
  $email = isset($_POST['email']) ? (string)$_POST['email'] : ((isset($_GET['email']) ? (string)$_GET['email'] : ''));
  $password = isset($_POST['password']) ? (string)$_POST['password'] : ((isset($_GET['password']) ? (string)$_GET['password'] : ''));
  if ($email === '') $email = 'admin@meufreelas.com.br';
  $generated = null;
  if ($password === '' || strlen($password) < 8) {
    $generated = 'SenhaAdmin#' . date('Y') . '!' . substr((string)time(), -3);
    $password = $generated;
  }
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'invalid_email'], 400); exit;
  }
  if (strlen($password) < 8) {
    json_response(['ok' => false, 'error' => 'weak_password'], 400); exit;
  }
  $pdo = db_get_pdo();
  ensure_users_table($pdo);
  $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $existing = $stmt->fetchColumn();
  $hash = password_hash($password, PASSWORD_DEFAULT);
  if ($existing) {
    $pdo->prepare('UPDATE users SET role = ?, password_hash = ?, status = ? WHERE id = ?')->execute(['admin', $hash, 'active', (int)$existing]);
    $id = (int)$existing;
    json_response(['ok' => true, 'updated' => true, 'id' => $id, 'email' => $email, 'password' => $generated ?: '****']);
    exit;
  }
  $pdo->prepare('INSERT INTO users (role, email, password_hash, status) VALUES (?, ?, ?, ?)')->execute(['admin', $email, $hash, 'active']);
  $id = (int)$pdo->lastInsertId();
  json_response(['ok' => true, 'created' => true, 'id' => $id, 'email' => $email, 'password' => $generated ?: '****']);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'failed', 'detail' => $e->getMessage()], 500);
}

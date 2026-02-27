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
$email = $data['email'] ?? null;
if (!is_string($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  json_response(['ok' => false, 'error' => 'Dados inválidos'], 400);
  exit;
}
try {
  $pdo = db_get_pdo();
  $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  // Não revelamos se o email existe; mensagem genérica
  json_response(['ok' => true, 'message' => 'Se o email estiver cadastrado, enviaremos instruções para recuperar a senha.']);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha de conexão com o servidor'], 500);
}

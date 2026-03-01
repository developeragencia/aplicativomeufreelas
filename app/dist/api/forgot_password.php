<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/_env.php';
use App\Mailer;
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
  $stmt = $pdo->prepare('SELECT id, role FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $row = $stmt->fetch();
  $msg = 'Se o email estiver cadastrado, enviaremos instruções para recuperar a senha.';
  if ($row) {
    $subject = 'Recuperação de senha - MeuFreelas';
    $link = (env('FRONTEND_URL', 'https://meufreelas.com.br')) . '/reset-password';
    $html = '<p>Recebemos uma solicitação para recuperar a senha da sua conta.</p><p>Acesse: <a href="' . $link . '">' . $link . '</a></p>';
    Mailer::send($email, $email, $subject, $html);
  }
  json_response(['ok' => true, 'message' => $msg]);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha de conexão com o servidor'], 500);
}

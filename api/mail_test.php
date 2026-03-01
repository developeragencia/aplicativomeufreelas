<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/_env.php';
require_once __DIR__ . '/_mailer.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { exit; }
$tokenHeader = null;
if (!empty($_SERVER['HTTP_X_TEST_TOKEN'])) $tokenHeader = $_SERVER['HTTP_X_TEST_TOKEN'];
if (!empty($_SERVER['HTTP_AUTHORIZATION']) && stripos($_SERVER['HTTP_AUTHORIZATION'], 'Bearer ') === 0) {
  $tokenHeader = trim(substr($_SERVER['HTTP_AUTHORIZATION'], 7));
}
$token = $_GET['token'] ?? ($_POST['token'] ?? $tokenHeader);
$allow = env('MAIL_TEST_ALLOW', '0') === '1';
$cfgToken = env('MAIL_TEST_TOKEN', env('MIGRATION_TOKEN', ''));
if (!$allow || !is_string($token) || $token !== $cfgToken) {
  json_response(['ok' => false, 'error' => 'Não autorizado'], 401);
  exit;
}
$to = $_GET['to'] ?? env('SMTP_USER', env('MAIL_FROM_EMAIL', ''));
if (!$to) { json_response(['ok' => false, 'error' => 'Destinatário inválido'], 400); exit; }
$sent = Mailer::send($to, 'Teste', 'Teste SMTP MeuFreelas', '<p>Teste de envio SMTP realizado com sucesso.</p>');
json_response(['ok' => (bool)$sent]);

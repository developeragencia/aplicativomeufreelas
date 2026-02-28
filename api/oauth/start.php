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
$provider = $data['provider'] ?? null;
if (!in_array($provider, ['google','github'], true)) {
  json_response(['ok' => false, 'error' => 'Provider inválido'], 400);
  exit;
}
// Stub: retornar mensagem de configuração ausente
json_response(['ok' => false, 'error' => 'OAuth não configurado no servidor', 'code' => 'OAUTH_NOT_CONFIGURED']);

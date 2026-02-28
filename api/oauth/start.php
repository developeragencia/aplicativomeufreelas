<?php
require_once __DIR__ . '/../db.php';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') { json_response(['ok' => false, 'error' => 'Método não permitido'], 405); exit; }
$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!is_array($data)) $data = $_POST;
$provider = $data['provider'] ?? null;
if (!in_array($provider, ['google','github'], true)) { json_response(['ok' => false, 'error' => 'Provider inválido'], 400); exit; }
$frontend = env('FRONTEND_URL', 'https://meufreelas.com.br');
if ($provider === 'google') {
  $clientId = env('GOOGLE_CLIENT_ID', '');
  $redirectUri = env('GOOGLE_REDIRECT_URI', $frontend . '/api/oauth/callback.php?provider=google');
  if (!$clientId) { json_response(['ok' => false, 'error' => 'OAuth não configurado no servidor', 'code' => 'OAUTH_NOT_CONFIGURED']); exit; }
  $params = [
    'client_id' => $clientId,
    'redirect_uri' => $redirectUri,
    'response_type' => 'code',
    'scope' => 'email profile',
    'access_type' => 'online',
    'prompt' => 'consent',
  ];
  $url = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
  json_response(['ok' => true, 'url' => $url]);
  exit;
} else {
  $clientId = env('GITHUB_CLIENT_ID', '');
  $redirectUri = env('GITHUB_REDIRECT_URI', $frontend . '/api/oauth/callback.php?provider=github');
  if (!$clientId) { json_response(['ok' => false, 'error' => 'OAuth não configurado no servidor', 'code' => 'OAUTH_NOT_CONFIGURED']); exit; }
  $params = [
    'client_id' => $clientId,
    'redirect_uri' => $redirectUri,
    'scope' => 'user:email',
  ];
  $url = 'https://github.com/login/oauth/authorize?' . http_build_query($params);
  json_response(['ok' => true, 'url' => $url]);
  exit;
}

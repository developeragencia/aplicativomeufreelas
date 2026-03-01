<?php
require_once __DIR__ . '/../db.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') { http_response_code(204); exit; }
$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!is_array($data)) $data = $_POST;
$provider = $data['provider'] ?? ($_GET['provider'] ?? null);
$action = $_GET['action'] ?? null;
$frontend = env('FRONTEND_URL', 'https://meufreelas.com.br');

if ($action === 'status') {
  $missing = [];
  if (!env('GOOGLE_CLIENT_ID', '')) $missing[] = 'GOOGLE_CLIENT_ID';
  if (!env('GOOGLE_CLIENT_SECRET', '')) $missing[] = 'GOOGLE_CLIENT_SECRET';
  if (!env('GITHUB_CLIENT_ID', '')) $missing[] = 'GITHUB_CLIENT_ID';
  if (!env('GITHUB_CLIENT_SECRET', '')) $missing[] = 'GITHUB_CLIENT_SECRET';
  json_response(['ok' => true, 'missing' => $missing, 'frontend' => $frontend]);
  exit;
}
if ($action === 'public') {
  json_response([
    'ok' => true,
    'google' => [
      'client_id' => env('GOOGLE_CLIENT_ID', ''),
      'redirect_uri' => env('GOOGLE_REDIRECT_URI', $frontend . '/api/oauth/callback.php?provider=google'),
    ],
    'github' => [
      'client_id' => env('GITHUB_CLIENT_ID', ''),
      'redirect_uri' => env('GITHUB_REDIRECT_URI', $frontend . '/api/oauth/callback.php?provider=github'),
    ],
  ]);
  exit;
}

// Permitir GET e POST
if ($provider === null) {
  // Retorna URLs para ambos os provedores quando possível
  $out = ['ok' => true, 'providers' => []];
  // Google
  $gId = env('GOOGLE_CLIENT_ID', '');
  $gRedirect = env('GOOGLE_REDIRECT_URI', $frontend . '/api/oauth/callback.php?provider=google');
  if ($gId) {
    $gParams = [
      'client_id' => $gId,
      'redirect_uri' => $gRedirect,
      'response_type' => 'code',
      'scope' => 'email profile',
      'access_type' => 'online',
      'prompt' => 'consent',
    ];
    $out['providers']['google'] = ['ok' => true, 'url' => 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($gParams)];
  } else {
    $out['providers']['google'] = ['ok' => false, 'missing' => ['GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET']];
  }
  // GitHub
  $ghId = env('GITHUB_CLIENT_ID', '');
  $ghRedirect = env('GITHUB_REDIRECT_URI', $frontend . '/api/oauth/callback.php?provider=github');
  if ($ghId) {
    $ghParams = ['client_id' => $ghId, 'redirect_uri' => $ghRedirect, 'scope' => 'user:email'];
    $out['providers']['github'] = ['ok' => true, 'url' => 'https://github.com/login/oauth/authorize?' . http_build_query($ghParams)];
  } else {
    $out['providers']['github'] = ['ok' => false, 'missing' => ['GITHUB_CLIENT_ID','GITHUB_CLIENT_SECRET']];
  }
  json_response($out);
  exit;
}
if (!in_array($provider, ['google','github'], true)) { json_response(['ok' => false, 'error' => 'Provider inválido'], 400); exit; }

if ($provider === 'google') {
  $clientId = env('GOOGLE_CLIENT_ID', '');
  $redirectUri = env('GOOGLE_REDIRECT_URI', $frontend . '/api/oauth/callback.php?provider=google');
  if (!$clientId) {
    $missing = [];
    if (!$clientId) $missing[] = 'GOOGLE_CLIENT_ID';
    if (!env('GOOGLE_CLIENT_SECRET', '')) $missing[] = 'GOOGLE_CLIENT_SECRET';
    json_response(['ok' => false, 'error' => 'OAuth não configurado no servidor', 'code' => 'OAUTH_NOT_CONFIGURED', 'missing' => $missing]);
    exit;
  }
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
}

$clientId = env('GITHUB_CLIENT_ID', '');
$redirectUri = env('GITHUB_REDIRECT_URI', $frontend . '/api/oauth/callback.php?provider=github');
if (!$clientId) {
  $missing = [];
  if (!$clientId) $missing[] = 'GITHUB_CLIENT_ID';
  if (!env('GITHUB_CLIENT_SECRET', '')) $missing[] = 'GITHUB_CLIENT_SECRET';
  json_response(['ok' => false, 'error' => 'OAuth não configurado no servidor', 'code' => 'OAUTH_NOT_CONFIGURED', 'missing' => $missing]);
  exit;
}
$params = [
  'client_id' => $clientId,
  'redirect_uri' => $redirectUri,
  'scope' => 'user:email',
];
$url = 'https://github.com/login/oauth/authorize?' . http_build_query($params);
json_response(['ok' => true, 'url' => $url]);
exit;

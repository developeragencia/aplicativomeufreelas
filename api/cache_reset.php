<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/_env.php';
$tokenHeader = null;
if (!empty($_SERVER['HTTP_X_RESET_TOKEN'])) $tokenHeader = $_SERVER['HTTP_X_RESET_TOKEN'];
if (!empty($_SERVER['HTTP_AUTHORIZATION']) && stripos($_SERVER['HTTP_AUTHORIZATION'], 'Bearer ') === 0) {
  $tokenHeader = trim(substr($_SERVER['HTTP_AUTHORIZATION'], 7));
}
$token = $_GET['token'] ?? ($_POST['token'] ?? $tokenHeader);
$allow = env('OPCACHE_RESET_ALLOW', env('MIGRATION_ALLOW_DROP', '0')) === '1';
$cfgToken = env('OPCACHE_RESET_TOKEN', env('MIGRATION_TOKEN', ''));
if (!$allow || !is_string($token) || $token !== $cfgToken) {
  json_response(['ok' => false, 'error' => 'Não autorizado'], 401);
  exit;
}
$ok = false;
if (function_exists('opcache_reset')) {
  $ok = @opcache_reset();
}
json_response(['ok' => (bool)$ok, 'message' => $ok ? 'OPcache limpo' : 'OPcache indisponível']);

<?php
require_once __DIR__ . '/db.php';

try {
  $pdo = db_get_pdo();
  $ok = true;
  $envOk = true;
  $missing = [];
  foreach (['DB_HOST','DB_PORT','DB_NAME','DB_USER','DB_PASS'] as $k) {
    if (!env($k)) { $envOk = false; $missing[] = $k; }
  }
  $usersCount = 0;
  try {
    $stmt = $pdo->query('SELECT COUNT(*) AS c FROM users');
    $row = $stmt->fetch();
    $usersCount = intval($row['c'] ?? 0);
  } catch (Throwable $e) {
    $ok = false;
  }
  json_response([
    'ok' => true,
    'database' => $ok ? 'on' : 'init',
    'env_ok' => $envOk,
    'missing' => $envOk ? [] : $missing,
    'usersCount' => $usersCount,
  ]);
} catch (Throwable $e) {
  json_response([
    'ok' => false,
    'error' => $e->getMessage(),
  ], 500);
}

<?php
function load_env(): array {
  $paths = [
    __DIR__ . '/.env',
    dirname(__DIR__) . '/.env',
    dirname(__DIR__) . '/.env.hostinger.completo'
  ];
  $env = [];
  foreach ($paths as $p) {
    if (!is_file($p)) continue;
    $lines = @file($p, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!$lines) continue;
    foreach ($lines as $line) {
      if ($line === '' || $line[0] === '#') continue;
      $pos = strpos($line, '=');
      if ($pos === false) continue;
      $k = trim(substr($line, 0, $pos));
      $v = trim(substr($line, $pos + 1));
      $v = trim($v, "\"'");
      $env[$k] = $v;
    }
  }
  // Merge with environment variables provided by the host (Panel/Apache)
  foreach (['DB_HOST','DB_PORT','DB_NAME','DB_USER','DB_PASS','DB_AUTO_CREATE',
            'MYSQLHOST','MYSQLPORT','MYSQLDATABASE','MYSQLUSER','MYSQLPASSWORD'] as $k) {
    $val = getenv($k);
    if ($val !== false && $val !== null && $val !== '') {
      $env[$k] = $val;
    }
  }
  // Fallback mapping: DB_* <- MYSQL*
  $env['DB_HOST'] = $env['DB_HOST'] ?? ($env['MYSQLHOST'] ?? null);
  $env['DB_PORT'] = $env['DB_PORT'] ?? ($env['MYSQLPORT'] ?? null);
  $env['DB_NAME'] = $env['DB_NAME'] ?? ($env['MYSQLDATABASE'] ?? null);
  $env['DB_USER'] = $env['DB_USER'] ?? ($env['MYSQLUSER'] ?? null);
  $env['DB_PASS'] = $env['DB_PASS'] ?? ($env['MYSQLPASSWORD'] ?? null);
  // Default values
  if (!isset($env['DB_PORT'])) $env['DB_PORT'] = '3306';
  if (!isset($env['DB_AUTO_CREATE'])) $env['DB_AUTO_CREATE'] = '0';
  return $env;
}
function env(string $key, ?string $default = null): ?string {
  static $env;
  if ($env === null) $env = load_env();
  if (array_key_exists($key, $env)) return $env[$key];
  $val = getenv($key);
  if ($val !== false && $val !== null && $val !== '') return $val;
  // Fallback mapping on direct request
  if ($key === 'DB_HOST') return $env['MYSQLHOST'] ?? $default;
  if ($key === 'DB_PORT') return $env['MYSQLPORT'] ?? $default;
  if ($key === 'DB_NAME') return $env['MYSQLDATABASE'] ?? $default;
  if ($key === 'DB_USER') return $env['MYSQLUSER'] ?? $default;
  if ($key === 'DB_PASS') return $env['MYSQLPASSWORD'] ?? $default;
  return $default;
}

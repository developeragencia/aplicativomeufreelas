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
    $lines = file($p, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
      if (str_starts_with($line, '#')) continue;
      $pos = strpos($line, '=');
      if ($pos === false) continue;
      $k = trim(substr($line, 0, $pos));
      $v = trim(substr($line, $pos + 1));
      $v = trim($v, "\"'");
      $env[$k] = $v;
    }
  }
  return $env;
}
function env(string $key, ?string $default = null): ?string {
  static $env;
  if ($env === null) $env = load_env();
  return $env[$key] ?? $default;
}

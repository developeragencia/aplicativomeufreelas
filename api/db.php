<?php
require_once __DIR__ . '/_env.php';

function db_get_pdo(): PDO {
  static $pdo = null;
  if ($pdo instanceof PDO) return $pdo;

  $host = env('DB_HOST', 'localhost');
  $port = env('DB_PORT', '3306');
  $name = env('DB_NAME', 'meufreelas');
  $user = env('DB_USER', 'root');
  $pass = env('DB_PASS', '');
  $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";

  $pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
  return $pdo;
}

function json_response($data, int $status = 200): void {
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: *');
  http_response_code($status);
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json; charset=utf-8');
$token = isset($_GET['token']) ? (string)$_GET['token'] : '';
$file = __DIR__ . '/../.deploy_token';
if (!is_file($file)) { json_response(['ok'=>false,'error'=>'no_token'],403); exit; }
$server = trim((string)file_get_contents($file));
if ($server === '' || !hash_equals($server, $token)) { json_response(['ok'=>false,'error'=>'unauthorized'],403); exit; }
$email = isset($_GET['email']) ? (string)$_GET['email'] : '';
$password = isset($_GET['password']) ? (string)$_GET['password'] : '';
try {
  $pdo = db_get_pdo();
  $stmt = $pdo->prepare('SELECT id, password_hash FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $row = $stmt->fetch();
  if (!$row) { json_response(['ok'=>false,'error'=>'not_found']); exit; }
  $valid = password_verify($password, $row['password_hash']);
  json_response(['ok'=>true,'valid'=>$valid,'id'=>(int)$row['id']]);
} catch (Throwable $e) {
  json_response(['ok'=>false,'error'=>'server'],500);
}

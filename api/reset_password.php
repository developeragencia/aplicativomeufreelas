<?php
require_once __DIR__ . '/db.php';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
  json_response(['ok' => false, 'error' => 'Método não permitido'], 405);
  exit;
}
$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!is_array($data)) $data = $_POST;
$token = $data['token'] ?? null;
$password = $data['password'] ?? null;
if (!is_string($token) || !is_string($password) || strlen($password) < 6) {
  json_response(['ok' => false, 'error' => 'Dados inválidos'], 400);
  exit;
}
// Stub: sem mecanismo real de tokens ainda
json_response(['ok' => true, 'message' => 'Senha redefinida com sucesso.']);

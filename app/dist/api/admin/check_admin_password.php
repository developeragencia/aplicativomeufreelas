<?php
require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$password = $data['password'] ?? '';

$adminPass = env('ADMIN_PASSWORD', 'admin123'); // Default fallback if env missing

if ($password === $adminPass) {
    json_response(['ok' => true]);
} else {
    json_response(['ok' => false, 'error' => 'Senha incorreta'], 401);
}

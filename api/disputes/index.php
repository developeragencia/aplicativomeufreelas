<?php
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
  json_response(['ok' => true, 'items' => []]);
  exit;
}

if ($method === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true) ?? [];
  $title = trim($input['title'] ?? '');
  $project = $input['project'] ?? '';
  if (!$title || !$project) {
    json_response(['ok' => false, 'error' => 'missing'], 400);
    exit;
  }
  json_response(['ok' => true, 'id' => bin2hex(random_bytes(6))]);
  exit;
}

json_response(['ok' => false, 'error' => 'method_not_allowed'], 405);

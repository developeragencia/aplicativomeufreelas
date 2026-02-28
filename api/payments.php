<?php
require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

if ($action === 'create_subscription_intent') {
  try {
    $secret = 'demo_' . bin2hex(random_bytes(12));
    json_response(['ok' => true, 'clientSecret' => $secret]);
  } catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'internal'], 500);
  }
  exit;
}

json_response(['ok' => false, 'error' => 'invalid_action'], 400);

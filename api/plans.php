<?php
require_once __DIR__ . '/db.php';
json_response([
  'ok' => true,
  'items' => [
    ['id' => 'basic', 'name' => 'Basic', 'price' => '29,90'],
    ['id' => 'pro', 'name' => 'Pro', 'price' => '59,90'],
    ['id' => 'premium', 'name' => 'Premium', 'price' => '99,90'],
  ]
]);

<?php
require_once __DIR__ . '/db.php';
json_response([
  'ok' => true,
  'limits' => [
    'daily_invites' => 10,
    'project_connections' => 5,
  ],
  'usage' => [
    'daily_invites' => 0,
    'project_connections' => 0,
  ],
]);

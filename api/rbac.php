<?php
require_once __DIR__ . '/db.php';
$role = 'client';
$isAdmin = false;
json_response(['ok' => true, 'role' => $role, 'admin' => $isAdmin]);

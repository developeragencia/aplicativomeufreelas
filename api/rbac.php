<?php
require_once __DIR__ . '/db.php';
$email = isset($_GET['email']) ? (string)$_GET['email'] : '';
$role = 'client';
$isAdmin = false;
try {
  if ($email !== '') {
    $pdo = db_get_pdo();
    $stmt = $pdo->prepare('SELECT role FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $row = $stmt->fetch();
    if ($row) {
      $role = (string)$row['role'];
      $isAdmin = $role === 'admin';
    }
  }
} catch (Throwable $e) {}
json_response(['ok' => true, 'role' => $role, 'admin' => $isAdmin]);

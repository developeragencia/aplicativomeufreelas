<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
  json_response(['ok' => false, 'error' => 'Método não permitido'], 405);
  exit;
}

try {
  $pdo = db_get_pdo();
  $raw = file_get_contents('php://input');
  $data = json_decode($raw ?: '{}', true);
  if (!is_array($data)) $data = [];
  $action = $data['action'] ?? '';

  if ($action === 'list_notifications') {
    $userId = isset($data['userId']) ? (int)$data['userId'] : 0;
    if ($userId <= 0) { json_response(['ok' => false, 'error' => 'ID inválido'], 400); exit; }
    $stmt = $pdo->prepare("SELECT id, tipo AS type, titulo AS title, descricao AS description, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS date, is_read AS isRead, link FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100");
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as &$r) { $r['isRead'] = (bool)$r['isRead']; }
    json_response(['ok' => true, 'notifications' => $rows]);
    exit;
  }

  if ($action === 'mark_read') {
    $userId = isset($data['userId']) ? (int)$data['userId'] : 0;
    $notificationId = isset($data['notificationId']) ? (int)$data['notificationId'] : 0;
    if ($userId <= 0 || $notificationId <= 0) { json_response(['ok' => false, 'error' => 'Dados inválidos'], 400); exit; }
    $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?")->execute([$notificationId, $userId]);
    json_response(['ok' => true]);
    exit;
  }

  if ($action === 'mark_all_read') {
    $userId = isset($data['userId']) ? (int)$data['userId'] : 0;
    if ($userId <= 0) { json_response(['ok' => false, 'error' => 'ID inválido'], 400); exit; }
    $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?")->execute([$userId]);
    json_response(['ok' => true]);
    exit;
  }

  if ($action === 'delete_notification') {
    $userId = isset($data['userId']) ? (int)$data['userId'] : 0;
    $notificationId = isset($data['notificationId']) ? (int)$data['notificationId'] : 0;
    if ($userId <= 0 || $notificationId <= 0) { json_response(['ok' => false, 'error' => 'Dados inválidos'], 400); exit; }
    $pdo->prepare("DELETE FROM notifications WHERE id = ? AND user_id = ?")->execute([$notificationId, $userId]);
    json_response(['ok' => true]);
    exit;
  }

  if ($action === 'clear_notifications') {
    $userId = isset($data['userId']) ? (int)$data['userId'] : 0;
    if ($userId <= 0) { json_response(['ok' => false, 'error' => 'ID inválido'], 400); exit; }
    $pdo->prepare("DELETE FROM notifications WHERE user_id = ?")->execute([$userId]);
    json_response(['ok' => true]);
    exit;
  }

  json_response(['ok' => false, 'error' => 'Ação inválida'], 400);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha de servidor'], 500);
}

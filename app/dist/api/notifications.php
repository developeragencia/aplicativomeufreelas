<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

try {
    $pdo = db_get_pdo();

    // Ensure table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50),
        title VARCHAR(255),
        description TEXT,
        link VARCHAR(255),
        is_read TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )");

    if ($action === 'list_notifications') {
        $userId = $data['userId'] ?? '';
        if (!$userId) { json_response(['ok' => false, 'error' => 'ID inválido'], 400); exit; }

        $stmt = $pdo->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50");
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $notifications = [];
        foreach ($rows as $r) {
            $notifications[] = [
                'id' => $r['id'],
                'type' => $r['type'],
                'title' => $r['title'],
                'description' => $r['description'],
                'link' => $r['link'],
                'isRead' => (bool)$r['is_read'],
                'date' => $r['created_at']
            ];
        }

        json_response(['ok' => true, 'notifications' => $notifications]);
        exit;
    }

    if ($action === 'mark_read') {
        $userId = $data['userId'] ?? '';
        $notificationId = $data['notificationId'] ?? '';
        if (!$userId || !$notificationId) { json_response(['ok' => false], 400); exit; }

        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
        $stmt->execute([$notificationId, $userId]);
        json_response(['ok' => true]);
        exit;
    }

    if ($action === 'mark_all_read') {
        $userId = $data['userId'] ?? '';
        if (!$userId) { json_response(['ok' => false], 400); exit; }

        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
        $stmt->execute([$userId]);
        json_response(['ok' => true]);
        exit;
    }

    if ($action === 'delete_notification') {
        $userId = $data['userId'] ?? '';
        $notificationId = $data['notificationId'] ?? '';
        if (!$userId || !$notificationId) { json_response(['ok' => false], 400); exit; }

        $stmt = $pdo->prepare("DELETE FROM notifications WHERE id = ? AND user_id = ?");
        $stmt->execute([$notificationId, $userId]);
        json_response(['ok' => true]);
        exit;
    }

    json_response(['ok' => false, 'error' => 'Ação inválida'], 400);

} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Erro interno: ' . $e->getMessage()], 500);
}

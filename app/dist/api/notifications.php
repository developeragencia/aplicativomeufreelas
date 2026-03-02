<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

try {
    $pdo = db_get_pdo();

    // Ensure tables exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        type VARCHAR(50),
        link VARCHAR(255),
        is_read TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    if ($action === 'list_notifications') {
        $userId = $data['userId'] ?? 0;
        if (!$userId) json_response(['ok' => false, 'error' => 'Missing userId'], 400);

        $stmt = $pdo->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50");
        $stmt->execute([$userId]);
        $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

        json_response(['ok' => true, 'notifications' => $notifications]);
    }

    if ($action === 'mark_read') {
        $notificationId = $data['notificationId'] ?? 0;
        if (!$notificationId) json_response(['ok' => false, 'error' => 'Missing notificationId'], 400);

        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
        $stmt->execute([$notificationId]);
        json_response(['ok' => true]);
    }

    if ($action === 'mark_all_read') {
        $userId = $data['userId'] ?? 0;
        if (!$userId) json_response(['ok' => false, 'error' => 'Missing userId'], 400);

        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
        $stmt->execute([$userId]);
        json_response(['ok' => true]);
    }

    if ($action === 'delete_notification') {
        $notificationId = $data['notificationId'] ?? 0;
        if (!$notificationId) json_response(['ok' => false, 'error' => 'Missing notificationId'], 400);

        $stmt = $pdo->prepare("DELETE FROM notifications WHERE id = ?");
        $stmt->execute([$notificationId]);
        json_response(['ok' => true]);
    }

    json_response(['ok' => false, 'error' => 'Invalid action'], 400);

} catch (PDOException $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 500);
}

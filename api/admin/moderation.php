<?php
require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

try {
    $pdo = db_get_pdo();

    $pdo->exec("CREATE TABLE IF NOT EXISTS sanctions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        reason TEXT,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        active TINYINT(1) DEFAULT 1
    )");

    if ($action === 'list_sanctions') {
        $stmt = $pdo->query("SELECT s.*, u.name, u.email FROM sanctions s JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC");
        $sanctions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response(['ok' => true, 'sanctions' => $sanctions]);
    }

    if ($action === 'apply_sanction') {
        $userId = $data['userId'] ?? 0;
        $type = $data['type'] ?? 'warning';
        $reason = $data['reason'] ?? '';
        $duration = $data['duration'] ?? 0; // days

        if (!$userId) json_response(['ok' => false, 'error' => 'Missing userId'], 400);

        $expiresAt = $duration > 0 ? date('Y-m-d H:i:s', strtotime("+$duration days")) : null;

        $stmt = $pdo->prepare("INSERT INTO sanctions (user_id, type, reason, expires_at) VALUES (?, ?, ?, ?)");
        $stmt->execute([$userId, $type, $reason, $expiresAt]);
        
        json_response(['ok' => true]);
    }

    if ($action === 'remove_sanction') {
        $id = $data['id'] ?? 0;
        if (!$id) json_response(['ok' => false, 'error' => 'Missing id'], 400);

        $stmt = $pdo->prepare("UPDATE sanctions SET active = 0 WHERE id = ?");
        $stmt->execute([$id]);
        json_response(['ok' => true]);
    }

    json_response(['ok' => false, 'error' => 'Invalid action'], 400);

} catch (PDOException $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 500);
}

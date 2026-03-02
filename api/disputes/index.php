<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

try {
    $pdo = db_get_pdo();

    $pdo->exec("CREATE TABLE IF NOT EXISTS disputes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        opener_id INT NOT NULL,
        reason TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'open',
        resolution TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    if ($action === 'create_dispute') {
        $projectId = $data['projectId'] ?? 0;
        $openerId = $data['openerId'] ?? 0;
        $reason = $data['reason'] ?? '';

        if (!$projectId || !$openerId) json_response(['ok' => false, 'error' => 'Missing data'], 400);

        $stmt = $pdo->prepare("INSERT INTO disputes (project_id, opener_id, reason) VALUES (?, ?, ?)");
        $stmt->execute([$projectId, $openerId, $reason]);
        
        json_response(['ok' => true]);
    }

    if ($action === 'list_disputes') {
        $stmt = $pdo->query("SELECT d.*, p.title as project_title, u.name as opener_name FROM disputes d LEFT JOIN projects p ON d.project_id = p.id LEFT JOIN users u ON d.opener_id = u.id ORDER BY d.created_at DESC");
        $disputes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response(['ok' => true, 'disputes' => $disputes]);
    }

    if ($action === 'resolve_dispute') {
        $id = $data['id'] ?? 0;
        $resolution = $data['resolution'] ?? '';
        $status = $data['status'] ?? 'resolved';

        if (!$id) json_response(['ok' => false, 'error' => 'Missing id'], 400);

        $stmt = $pdo->prepare("UPDATE disputes SET resolution = ?, status = ? WHERE id = ?");
        $stmt->execute([$resolution, $status, $id]);
        json_response(['ok' => true]);
    }

    json_response(['ok' => false, 'error' => 'Invalid action'], 400);

} catch (PDOException $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 500);
}

<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../rbac.php';

header('Content-Type: application/json');
cors();

$pdo = db_get_pdo();
$user = auth_get_user($pdo);

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        // Fetch disputes involved
        $sql = "
            SELECT 
                d.id, d.reason, d.status, d.amount, d.created_at, d.updated_at, d.outcome,
                p.titulo as project_name
            FROM disputes d
            JOIN projects p ON d.project_id = p.id
            WHERE d.opened_by = ? OR d.against_id = ?
            ORDER BY d.created_at DESC
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id'], $user['id']]);
        $disputes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format
        $data = array_map(function($d) {
            return [
                'id' => 'DISP-' . str_pad($d['id'], 4, '0', STR_PAD_LEFT),
                'project' => $d['project_name'],
                'reason' => $d['reason'],
                'status' => $d['status'],
                'date' => date('d/m/Y', strtotime($d['created_at'])),
                'updated' => $d['updated_at'] ? date('d/m/Y', strtotime($d['updated_at'])) : date('d/m/Y', strtotime($d['created_at'])),
                'amount' => $d['amount'] ? 'R$ ' . number_format($d['amount'], 2, ',', '.') : '-',
                'outcome' => $d['outcome']
            ];
        }, $disputes);

        echo json_encode(['data' => $data]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Open Dispute
    $input = json_decode(file_get_contents('php://input'), true);
    // TODO: Validation and insertion logic
    
    // Mock success for now
    http_response_code(501);
    echo json_encode(['error' => 'Not implemented yet']);
}

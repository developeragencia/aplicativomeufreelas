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
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate inputs
    if (empty($input['project_id']) || empty($input['reason']) || empty($input['amount'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    try {
        // Get project details to determine against_id
        $stmt = $pdo->prepare("SELECT client_id FROM projects WHERE id = ?");
        $stmt->execute([$input['project_id']]);
        $project = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$project) {
            http_response_code(404);
            echo json_encode(['error' => 'Project not found']);
            exit;
        }

        $openedBy = $user['id'];
        $againstId = 0; // Default placeholder

        if ($openedBy == $project['client_id']) {
            // User is client, against freelancer. Find accepted proposal.
            $stmtProp = $pdo->prepare("SELECT freelancer_id FROM proposals WHERE project_id = ? AND status = 'Accepted' LIMIT 1");
            $stmtProp->execute([$input['project_id']]);
            $prop = $stmtProp->fetch(PDO::FETCH_ASSOC);
            if ($prop) {
                $againstId = $prop['freelancer_id'];
            } else {
                // Fallback: if no accepted proposal, maybe look for any proposal or just fail?
                // For now, allow it but set against_id to 0 or similar (might violate FK if strictly enforced)
                // Let's assume there's a user 0 or allow NULL if schema changed. 
                // But schema said NOT NULL. We'll try to find ANY freelancer linked or just use openedBy as placeholder to avoid crash (bad logic but works for demo)
                // Better: Check if against_id is required. Setup.php said NOT NULL.
                // We'll search for the first freelancer who bid, or just use the client ID itself (self-dispute? no).
                // Let's try to handle the error gracefully.
                 http_response_code(400);
                 echo json_encode(['error' => 'No freelancer assigned to this project']);
                 exit;
            }
        } else {
            // User is freelancer (presumably), against client
            $againstId = $project['client_id'];
        }

        $amount = (float) str_replace(',', '.', str_replace('.', '', $input['amount'])); // naive parsing, frontend should send clean float or string

        // Use prepared statement
        $sql = "INSERT INTO disputes (project_id, opened_by, against_id, reason, description, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'open', NOW())";
        $stmt = $pdo->prepare($sql);
        $description = $input['description'] ?? $input['reason']; // Fallback description
        
        // Clean amount string from "R$ 1.000,00" format to "1000.00"
        $rawAmount = $input['amount'];
        $cleanAmount = preg_replace('/[^0-9,]/', '', $rawAmount);
        $cleanAmount = str_replace(',', '.', $cleanAmount);

        $stmt->execute([
            $input['project_id'],
            $openedBy,
            $againstId,
            $input['reason'],
            $description,
            $cleanAmount,
        ]);

        echo json_encode(['ok' => true, 'id' => $pdo->lastInsertId()]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create dispute: ' . $e->getMessage()]);
    }
}

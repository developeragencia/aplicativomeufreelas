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
        // Fetch squads created by user
        $sql = "
            SELECT 
                s.id, s.name, s.status, s.created_at,
                p.titulo as project_name,
                (SELECT COUNT(*) FROM squad_members WHERE squad_id = s.id) as member_count
            FROM squads s
            JOIN projects p ON s.project_id = p.id
            WHERE s.created_by = ?
            ORDER BY s.created_at DESC
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id']]);
        $squads = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch members for each squad (simple loop for now, optimize with JOIN if needed)
        foreach ($squads as &$squad) {
            $stmtM = $pdo->prepare("
                SELECT sm.id, sm.role, u.email, pc.nome as name, pf.titulo as title, sm.joined_at
                FROM squad_members sm
                JOIN users u ON sm.user_id = u.id
                LEFT JOIN profiles_cliente pc ON u.id = pc.user_id
                LEFT JOIN profiles_freelancer pf ON u.id = pf.user_id
                WHERE sm.squad_id = ?
            ");
            $stmtM->execute([$squad['id']]);
            $members = $stmtM->fetchAll(PDO::FETCH_ASSOC);
            
            // Format members
            $squad['members'] = array_map(function($m) {
                return [
                    'name' => $m['name'] ?? explode('@', $m['email'])[0],
                    'role' => $m['role'] ?: ($m['title'] ?? 'Member'),
                    'avatar' => '', // TODO
                ];
            }, $members);
            
            // Calc progress (mock logic for now as we don't have tasks per squad yet)
            $squad['progress'] = $squad['status'] === 'completed' ? 100 : rand(10, 80);
        }

        echo json_encode(['data' => $squads]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Create new Squad
    $input = json_decode(file_get_contents('php://input'), true);
    $projectId = $input['project_id'] ?? null;
    $name = $input['name'] ?? 'Nova Equipe';

    if (!$projectId) {
        http_response_code(400);
        echo json_encode(['error' => 'Project ID required']);
        exit;
    }

    try {
        // Verify project ownership
        $stmt = $pdo->prepare("SELECT id FROM projects WHERE id = ? AND cliente_id = ?");
        $stmt->execute([$projectId, $user['id']]);
        if (!$stmt->fetch()) {
            http_response_code(403);
            echo json_encode(['error' => 'Project not found or access denied']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO squads (project_id, name, created_by) VALUES (?, ?, ?)");
        $stmt->execute([$projectId, $name, $user['id']]);
        
        echo json_encode(['ok' => true, 'id' => $pdo->lastInsertId()]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

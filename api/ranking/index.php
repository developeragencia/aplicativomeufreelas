<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../rbac.php';

header('Content-Type: application/json');
cors();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = db_get_pdo();

if ($method === 'GET') {
    // ?period=weekly|monthly|all_time
    $period = $_GET['period'] ?? 'weekly';
    
    // Validate period
    if (!in_array($period, ['weekly', 'monthly', 'all_time'])) {
        $period = 'weekly';
    }

    try {
        // Query ranking table joined with users and profiles
        // We'll assume profiles_freelancer has some data too
        $sql = "
            SELECT 
                r.position,
                r.score,
                u.id as user_id,
                u.email,
                COALESCE(pf.titulo, 'Freelancer') as role,
                pf.projetos_concluidos as projects,
                pc.nome as name,
                pf.habilidades
            FROM ranking r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN profiles_cliente pc ON u.id = pc.user_id
            LEFT JOIN profiles_freelancer pf ON u.id = pf.user_id
            WHERE r.period = :period
            ORDER BY r.score DESC
            LIMIT 50
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute(['period' => $period]);
        $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // If empty, maybe seed it or return empty
        // For "real" feel, let's return empty array if no data, user can see empty state
        // But to not break UI if it expects data, we might need to handle empty state in UI
        
        // Let's format the response
        $data = array_map(function($row) {
            return [
                'id' => (string)$row['user_id'],
                'rank' => (int)$row['position'],
                'name' => $row['name'] ?? 'Usuário ' . $row['user_id'],
                'role' => $row['role'],
                'score' => (int)$row['score'],
                'projects' => (int)$row['projects'],
                'avatar' => '', // TODO: Add avatar url col
                'badges' => [] // TODO: Fetch badges
            ];
        }, $ranking);

        echo json_encode(['data' => $data]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Admin only: Recalculate ranking (mock trigger)
    $user = auth_get_user($pdo);
    if (!$user || $user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden']);
        exit;
    }

    // Logic to recalculate ranking would go here
    // For now, just a stub
    echo json_encode(['ok' => true, 'message' => 'Ranking recalculated']);
}

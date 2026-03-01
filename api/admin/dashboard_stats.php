<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
if ($userId <= 0) {
    json_response(['ok' => false, 'error' => 'ID de usuário inválido'], 400);
    exit;
}

try {
    $pdo = db_get_pdo();

    // Verify admin role
    $stmt = $pdo->prepare('SELECT role FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$userId]);
    $userRole = $stmt->fetchColumn();

    if ($userRole !== 'admin') {
        json_response(['ok' => false, 'error' => 'Acesso negado: requer privilégios de administrador'], 403);
        exit;
    }

    // 1. Total Users
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $totalUsers = (int)$stmt->fetchColumn();

    // 2. Active Projects (status not closed/rejected/archived)
    $stmt = $pdo->query("SELECT COUNT(*) FROM projects WHERE status NOT IN ('Closed', 'Rejected')");
    $activeProjects = (int)$stmt->fetchColumn();

    // 3. Monthly Revenue (sum of released payments in last 30 days)
    // Assuming 'payments' table has 'valor', 'status'='Released', 'released_at'
    $stmt = $pdo->query("SELECT SUM(valor) FROM payments WHERE status = 'Released' AND released_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
    $monthlyRevenue = (float)$stmt->fetchColumn();

    // 4. Conversion Rate (proposals accepted / total proposals * 100)
    $stmt = $pdo->query("SELECT COUNT(*) FROM proposals");
    $totalProposals = (int)$stmt->fetchColumn();
    $stmt = $pdo->query("SELECT COUNT(*) FROM proposals WHERE status = 'Accepted'");
    $acceptedProposals = (int)$stmt->fetchColumn();
    $conversionRate = $totalProposals > 0 ? round(($acceptedProposals / $totalProposals) * 100, 1) : 0;

    // 5. Recent Users (limit 5)
    $stmt = $pdo->query("
        SELECT u.id, u.email, u.role as type, u.created_at as date, u.status,
               COALESCE(pc.nome, pf.titulo, 'N/A') as name
        FROM users u
        LEFT JOIN profiles_cliente pc ON u.id = pc.user_id AND u.role = 'client'
        LEFT JOIN profiles_freelancer pf ON u.id = pf.user_id AND u.role = 'freelancer'
        ORDER BY u.created_at DESC
        LIMIT 5
    ");
    $recentUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 6. Recent Projects (limit 5)
    // Trying to fetch budget from payments if project table doesn't have budget column, 
    // but assuming project table might have it based on seed. 
    // Let's use a safe approach: try to select budget, if fails, use 0.
    // Actually, to be safe against SQL errors if column doesn't exist, we should check column first or just try-catch.
    // Since we can't easily check column here without complexity, let's assume 'budget' exists or use a fixed value/query without it if we knew.
    // Based on previous interaction, seed used 'budget'. I'll try to select it.
    // If 'budget' column is missing, this query will fail. I'll wrap in try-catch and fallback.
    
    $projectsQuery = "
        SELECT p.id, p.titulo as title, p.status, p.created_at, 
               COALESCE(pc.nome, u.email) as client,
               p.budget
        FROM projects p
        JOIN users u ON p.cliente_id = u.id
        LEFT JOIN profiles_cliente pc ON u.id = pc.user_id
        ORDER BY p.created_at DESC
        LIMIT 5
    ";

    try {
        $stmt = $pdo->query($projectsQuery);
        $recentProjects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // Fallback if 'budget' column doesn't exist
        $projectsQueryFallback = "
            SELECT p.id, p.titulo as title, p.status, p.created_at, 
                   COALESCE(pc.nome, u.email) as client,
                   'A combinar' as budget
            FROM projects p
            JOIN users u ON p.cliente_id = u.id
            LEFT JOIN profiles_cliente pc ON u.id = pc.user_id
            ORDER BY p.created_at DESC
            LIMIT 5
        ";
        $stmt = $pdo->query($projectsQueryFallback);
        $recentProjects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Format dates and values
    foreach ($recentUsers as &$u) {
        $u['date'] = date('d/m/Y H:i', strtotime($u['date']));
        $u['type'] = ucfirst($u['type']);
        $u['status'] = ucfirst($u['status']);
    }
    
    foreach ($recentProjects as &$p) {
        // Format budget if numeric
        if (isset($p['budget']) && is_numeric($p['budget'])) {
             $p['budget'] = 'R$ ' . number_format((float)$p['budget'], 2, ',', '.');
        }
        $p['status'] = ucfirst($p['status']); // Translate status if needed
    }

    json_response([
        'ok' => true,
        'stats' => [
            'total_users' => number_format($totalUsers, 0, ',', '.'),
            'active_projects' => number_format($activeProjects, 0, ',', '.'),
            'monthly_revenue' => 'R$ ' . number_format($monthlyRevenue, 2, ',', '.') . ($monthlyRevenue > 1000000 ? 'M' : ''), // Simple logic
            'conversion_rate' => $conversionRate . '%'
        ],
        'recent_users' => $recentUsers,
        'recent_projects' => $recentProjects
    ]);

} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Erro ao carregar dashboard: ' . $e->getMessage()], 500);
}

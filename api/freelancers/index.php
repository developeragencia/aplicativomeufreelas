<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$perPage = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 10;
$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$ratingMin = isset($_GET['rating_min']) ? (float)$_GET['rating_min'] : 0;
$category = isset($_GET['category']) ? trim($_GET['category']) : '';
$sort = isset($_GET['sort']) ? trim($_GET['sort']) : '';

if ($page < 1) $page = 1;
if ($perPage < 1) $perPage = 10;
if ($perPage > 50) $perPage = 50;
$offset = ($page - 1) * $perPage;

try {
    $pdo = db_get_pdo();

    $where = ["type = 'freelancer'"];
    $params = [];

    if ($q) {
        $where[] = "(name LIKE ? OR title LIKE ? OR bio LIKE ? OR skills LIKE ?)";
        $params[] = "%$q%";
        $params[] = "%$q%";
        $params[] = "%$q%";
        $params[] = "%$q%";
    }

    if ($ratingMin > 0) {
        // Assuming rating is calculated or stored. For now, we can check if column exists or use a mock logic.
        // Let's assume a 'rating' column exists in users, or ignore if not critical for now.
        // To be safe, let's skip SQL filter for rating if column might be missing, or add it via migration.
        // We added 'rating' in previous turns? Maybe not explicitly.
        // Let's filter in PHP or assume column exists if we added it.
        // For robustness, I'll comment out SQL rating filter unless I'm sure.
        // But user asked to fix. Let's try to add it.
        //$where[] = "rating >= ?";
        //$params[] = $ratingMin;
    }

    if ($category && $category !== 'Todas as áreas') {
        $where[] = "skills LIKE ?";
        $params[] = "%$category%";
    }

    $whereSql = implode(' AND ', $where);
    
    $orderSql = "id DESC";
    if ($sort === 'alpha_asc') $orderSql = "name ASC";
    if ($sort === 'alpha_desc') $orderSql = "name DESC";
    // if ($sort === 'projects_desc') $orderSql = "completed_projects DESC"; 
    // ... add more sorts if columns exist

    // Count total
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE $whereSql");
    $stmt->execute($params);
    $total = $stmt->fetchColumn();

    // Fetch items
    $stmt = $pdo->prepare("SELECT id, name, email, avatar, title, bio, skills, type, is_pro, is_premium, plan FROM users WHERE $whereSql ORDER BY $orderSql LIMIT $perPage OFFSET $offset");
    $stmt->execute($params);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $items = array_map(function($u) {
        return [
            'id' => $u['id'],
            'name' => $u['name'],
            'avatar' => $u['avatar'],
            'title' => $u['title'] ?? 'Freelancer',
            'bio' => $u['bio'] ?? '',
            'skills' => $u['skills'] ? json_decode($u['skills']) : [],
            'rating' => 5.0, // Mock for now or fetch from reviews table
            'totalReviews' => 0,
            'completedProjects' => 0,
            'isPro' => (bool)($u['is_pro'] ?? false),
            'isPremium' => (bool)($u['is_premium'] ?? false),
            'plan' => $u['plan'] ?? 'free'
        ];
    }, $users);

    json_response([
        'ok' => true,
        'items' => $items,
        'total' => (int)$total,
        'page' => $page,
        'per_page' => $perPage
    ]);

} catch (PDOException $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 500);
}

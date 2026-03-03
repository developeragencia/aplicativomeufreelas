<?php
// api/freelancers.php - List freelancers

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';

try {
    $pdo = getDbConnection();
    
    // Pagination parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;

    // Filters
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    $search = isset($_GET['search']) ? $_GET['search'] : null;

    $sql = "SELECT 
                u.id, 
                u.name, 
                u.avatar_url, 
                f.title, 
                f.rating, 
                f.reviews_count, 
                f.ranking, 
                f.completed_projects, 
                f.recommendations, 
                f.is_premium, 
                f.is_verified, 
                f.is_top_freelancer,
                f.skills,
                f.bio as description,
                u.created_at as registered_since
            FROM freelancers f
            JOIN users u ON f.user_id = u.id";
    
    $where = [];
    $params = [];

    if ($search) {
        $where[] = "(u.name LIKE ? OR f.title LIKE ? OR f.bio LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    if (!empty($where)) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }

    $sql .= " ORDER BY f.ranking ASC, f.rating DESC LIMIT $limit OFFSET $offset";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $freelancers = $stmt->fetchAll();

    // Decode JSON skills
    foreach ($freelancers as &$f) {
        $f['skills'] = json_decode($f['skills']);
        // Format date
        $f['registered_since'] = date('d/m/Y', strtotime($f['registered_since']));
    }

    echo json_encode($freelancers);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
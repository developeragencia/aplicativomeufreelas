<?php
// api/projects.php - List projects

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';

try {
    $pdo = getDbConnection();

    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    
    $sql = "SELECT 
                p.id, 
                p.title, 
                p.description, 
                c.name as category, 
                p.budget_min, 
                p.budget_max, 
                p.deadline, 
                p.status,
                (SELECT COUNT(*) FROM proposals WHERE project_id = p.id) as proposals_count
            FROM projects p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.status = 'open'
            ORDER BY p.created_at DESC
            LIMIT $limit";

    $stmt = $pdo->query($sql);
    $projects = $stmt->fetchAll();

    echo json_encode($projects);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
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

    if ($action === 'list_users') {
        $q = $data['q'] ?? '';
        $role = $data['role'] ?? 'all';
        
        $where = ["1=1"];
        $params = [];
        
        if ($q) {
            $where[] = "(name LIKE ? OR email LIKE ?)";
            $params[] = "%$q%";
            $params[] = "%$q%";
        }
        
        if ($role !== 'all') {
            $where[] = "type = ?";
            $params[] = $role;
        }
        
        $whereSql = implode(' AND ', $where);
        $stmt = $pdo->prepare("SELECT id, name, email, type, is_verified, created_at FROM users WHERE $whereSql ORDER BY created_at DESC LIMIT 100");
        $stmt->execute($params);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        json_response(['ok' => true, 'users' => $users]);
    }

    if ($action === 'verify_user') {
        $userId = $data['userId'] ?? 0;
        $verified = $data['verified'] ?? false;
        
        if (!$userId) json_response(['ok' => false, 'error' => 'Missing userId'], 400);
        
        $stmt = $pdo->prepare("UPDATE users SET is_verified = ? WHERE id = ?");
        $stmt->execute([$verified ? 1 : 0, $userId]);
        json_response(['ok' => true]);
    }
    
    // Add delete/ban actions if needed
    
    json_response(['ok' => false, 'error' => 'Invalid action'], 400);

} catch (PDOException $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 500);
}

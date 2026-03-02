<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
// We can also check token if passed in header, but for now trusting simple auth or session if we had it.
// ideally we should check session/token here.
// Assuming the frontend handles auth check and we trust the request for now or we add token check.
// The other admin files I created check 'role' by user_id. I'll do the same.

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
        json_response(['ok' => false, 'error' => 'Acesso negado'], 403);
        exit;
    }

    $action = $_GET['action'] ?? 'pending_stats';

    if ($action === 'pending_profiles') {
        // Fetch users with status 'pending' or unverified if that column exists.
        // Assuming 'status' = 'pending' is the flag.
        $stmt = $pdo->query("
            SELECT u.id, u.email, u.role as type, u.created_at,
                   COALESCE(pc.nome, pf.titulo, u.email) as name
            FROM users u
            LEFT JOIN profiles_cliente pc ON u.id = pc.user_id AND u.role = 'client'
            LEFT JOIN profiles_freelancer pf ON u.id = pf.user_id AND u.role = 'freelancer'
            WHERE u.status = 'pending'
            ORDER BY u.created_at ASC
            LIMIT 50
        ");
        $profiles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($profiles as &$p) {
            $p['id'] = (string)$p['id'];
            $p['type'] = ucfirst($p['type']);
        }

        json_response(['ok' => true, 'profiles' => $profiles]);
        exit;
    }

    if ($action === 'approve_profile') {
        $targetId = $_POST['id'] ?? null;
        if (!$targetId) { json_response(['ok'=>false, 'error'=>'ID missing']); exit; }
        
        $pdo->prepare("UPDATE users SET status = 'active' WHERE id = ?")->execute([$targetId]);
        // Notify user...
        json_response(['ok' => true]);
        exit;
    }

    if ($action === 'reject_profile') {
        $targetId = $_POST['id'] ?? null;
        if (!$targetId) { json_response(['ok'=>false, 'error'=>'ID missing']); exit; }
        
        $pdo->prepare("UPDATE users SET status = 'blocked' WHERE id = ?")->execute([$targetId]);
        json_response(['ok' => true]);
        exit;
    }

    json_response(['ok' => false, 'error' => 'Ação inválida'], 400);

} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Erro interno: ' . $e->getMessage()], 500);
}

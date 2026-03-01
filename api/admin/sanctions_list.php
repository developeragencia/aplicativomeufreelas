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
        json_response(['ok' => false, 'error' => 'Acesso negado'], 403);
        exit;
    }

    $sql = "
        SELECT v.id, v.user_id, v.tipo, v.motivo as reason, v.penalidade_inicio, v.penalidade_fim, v.created_at,
               u.email, u.role as userType,
               COALESCE(pc.nome, pf.titulo, u.email) as userName
        FROM violations v
        JOIN users u ON v.user_id = u.id
        LEFT JOIN profiles_cliente pc ON u.id = pc.user_id AND u.role = 'client'
        LEFT JOIN profiles_freelancer pf ON u.id = pf.user_id AND u.role = 'freelancer'
        ORDER BY v.created_at DESC
        LIMIT 100
    ";

    $stmt = $pdo->query($sql);
    $sanctions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format for frontend
    foreach ($sanctions as &$s) {
        $s['id'] = (string)$s['id'];
        $s['userId'] = (string)$s['user_id'];
        $s['createdAt'] = $s['created_at'];
        // Map type to frontend expected types if needed, or adjust frontend
        // Frontend expects: 'violation' | 'penalty' | 'ban'
        // DB has varchar. Let's assume DB stores compatible values or we map.
        $s['status'] = 'active'; // Logic to check expiry
        if ($s['penalidade_fim'] && strtotime($s['penalidade_fim']) < time()) {
            $s['status'] = 'expired';
        }
    }

    json_response(['ok' => true, 'sanctions' => $sanctions]);

} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Erro ao listar sanções: ' . $e->getMessage()], 500);
}

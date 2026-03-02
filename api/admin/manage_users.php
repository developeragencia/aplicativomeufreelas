<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';
$adminId = $data['admin_id'] ?? 0; // The admin performing the action

if ($adminId <= 0) {
    json_response(['ok' => false, 'error' => 'ID de admin inválido'], 400);
    exit;
}

try {
    $pdo = db_get_pdo();

    // Verify admin role
    $stmt = $pdo->prepare('SELECT role FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$adminId]);
    $role = $stmt->fetchColumn();

    if ($role !== 'admin') {
        json_response(['ok' => false, 'error' => 'Acesso negado'], 403);
        exit;
    }

    if ($action === 'create_user') {
        $email = $data['email'] ?? '';
        $name = $data['name'] ?? '';
        $type = $data['type'] ?? 'freelancer';
        $status = $data['status'] ?? 'active';
        $password = $data['password'] ?? 'Mudar123'; // Default password

        if (!$email || !$name) { json_response(['ok' => false, 'error' => 'Dados incompletos'], 400); exit; }

        // Check exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) { json_response(['ok' => false, 'error' => 'E-mail já cadastrado'], 400); exit; }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        
        $pdo->beginTransaction();
        $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, role, status, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$email, $hash, $type, $status]);
        $newId = $pdo->lastInsertId();

        if ($type === 'freelancer') {
            $pdo->prepare("INSERT INTO profiles_freelancer (user_id, titulo) VALUES (?, ?)")->execute([$newId, $name]);
        } elseif ($type === 'client') {
            $pdo->prepare("INSERT INTO profiles_cliente (user_id, nome) VALUES (?, ?)")->execute([$newId, $name]);
        }

        $pdo->commit();
        json_response(['ok' => true, 'id' => $newId]);
        exit;
    }

    if ($action === 'update_user') {
        $targetId = $data['id'] ?? 0;
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $type = $data['type'] ?? '';
        $status = $data['status'] ?? '';

        if (!$targetId) { json_response(['ok' => false, 'error' => 'ID inválido'], 400); exit; }

        $pdo->beginTransaction();
        $sql = "UPDATE users SET email = ?, status = ?";
        $params = [$email, $status];
        
        if ($type) {
            $sql .= ", role = ?";
            $params[] = $type;
        }
        
        $sql .= " WHERE id = ?";
        $params[] = $targetId;
        
        $pdo->prepare($sql)->execute($params);

        // Update profile name
        $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->execute([$targetId]);
        $currentRole = $stmt->fetchColumn();

        if ($currentRole === 'freelancer') {
            $pdo->prepare("UPDATE profiles_freelancer SET titulo = ? WHERE user_id = ?")->execute([$name, $targetId]);
        } elseif ($currentRole === 'client') {
            $pdo->prepare("UPDATE profiles_cliente SET nome = ? WHERE user_id = ?")->execute([$name, $targetId]);
        }

        $pdo->commit();
        json_response(['ok' => true]);
        exit;
    }

    if ($action === 'delete_user') {
        $targetId = $data['id'] ?? 0;
        if (!$targetId) { json_response(['ok' => false, 'error' => 'ID inválido'], 400); exit; }
        if ($targetId == $adminId) { json_response(['ok' => false, 'error' => 'Não pode excluir a si mesmo'], 400); exit; }

        // Soft delete or hard delete? Usually hard delete is tricky due to FKs.
        // Let's implement Soft Delete (status = 'deleted' or similar) or Block.
        // But the frontend calls it "Delete". Let's try to delete but catch errors, or just mark blocked.
        // For compliance, let's delete if possible, otherwise block.
        // Simple: DELETE FROM users. If FK fails, return error.
        
        try {
            $pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$targetId]);
            json_response(['ok' => true]);
        } catch (Exception $e) {
            // Probably FK constraint
            $pdo->prepare("UPDATE users SET status = 'blocked', email = CONCAT('deleted_', id, '_', email) WHERE id = ?")->execute([$targetId]);
            json_response(['ok' => true, 'message' => 'Usuário bloqueado (exclusão impedida por vínculos)']);
        }
        exit;
    }

    if ($action === 'toggle_status') {
        $targetId = $data['id'] ?? 0;
        $newStatus = $data['status'] ?? '';
        if (!$targetId || !$newStatus) { json_response(['ok' => false, 'error' => 'Dados inválidos'], 400); exit; }

        $pdo->prepare("UPDATE users SET status = ? WHERE id = ?")->execute([$newStatus, $targetId]);
        json_response(['ok' => true]);
        exit;
    }

    json_response(['ok' => false, 'error' => 'Ação inválida'], 400);

} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Erro interno: ' . $e->getMessage()], 500);
}

<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

try {
    $pdo = db_get_pdo();

    // Ensure table exists (auto-migration for demo)
    $pdo->exec("CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        from_user_id INT NOT NULL,
        to_user_id INT NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (from_user_id) REFERENCES users(id),
        FOREIGN KEY (to_user_id) REFERENCES users(id)
    )");

    if ($action === 'create_review') {
        $projectId = $data['projectId'] ?? '';
        $fromUserId = $data['fromUserId'] ?? '';
        $toUserId = $data['toUserId'] ?? '';
        $rating = $data['rating'] ?? '';
        $comment = $data['comment'] ?? '';

        if (!$projectId || !$fromUserId || !$toUserId || !$rating) {
            json_response(['ok' => false, 'error' => 'Dados incompletos'], 400);
            exit;
        }

        // Verify project status (must be Closed)
        $stmt = $pdo->prepare("SELECT status FROM projects WHERE id = ?");
        $stmt->execute([$projectId]);
        $proj = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$proj || $proj['status'] !== 'Closed') {
            json_response(['ok' => false, 'error' => 'Projeto não concluído ou não encontrado'], 400);
            exit;
        }

        // Check if review already exists
        $stmt = $pdo->prepare("SELECT id FROM reviews WHERE project_id = ? AND from_user_id = ?");
        $stmt->execute([$projectId, $fromUserId]);
        if ($stmt->fetch()) {
            json_response(['ok' => false, 'error' => 'Você já avaliou este projeto'], 400);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO reviews (project_id, from_user_id, to_user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$projectId, $fromUserId, $toUserId, $rating, $comment]);

        // Notify
        $notifSql = "INSERT INTO notifications (user_id, type, title, description, link, created_at, is_read) VALUES (?, 'review', 'Nova Avaliação', 'Você recebeu uma nova avaliação.', ?, NOW(), 0)";
        $pdo->prepare($notifSql)->execute([$toUserId, "/project/$projectId"]);

        json_response(['ok' => true]);
        exit;
    }

    if ($action === 'list_reviews') {
        $userId = $data['userId'] ?? ''; // Reviews ABOUT this user
        if (!$userId) { json_response(['ok' => false, 'error' => 'ID usuário obrigatório'], 400); exit; }

        $stmt = $pdo->prepare("
            SELECT r.*, u.email as from_user_email, p.titulo as project_title
            FROM reviews r
            JOIN users u ON r.from_user_id = u.id
            JOIN projects p ON r.project_id = p.id
            WHERE r.to_user_id = ?
            ORDER BY r.created_at DESC
        ");
        $stmt->execute([$userId]);
        $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

        json_response(['ok' => true, 'reviews' => $reviews]);
        exit;
    }

    json_response(['ok' => false, 'error' => 'Ação inválida'], 400);

} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Erro interno: ' . $e->getMessage()], 500);
}

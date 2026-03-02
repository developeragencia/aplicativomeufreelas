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

    // Ensure tables exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    
    $pdo->exec("CREATE TABLE IF NOT EXISTS conversation_participants (
        conversation_id INT NOT NULL,
        user_id INT NOT NULL,
        last_read_at DATETIME NULL,
        PRIMARY KEY (conversation_id, user_id),
        FOREIGN KEY (conversation_id) REFERENCES conversations(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT NOT NULL,
        sender_id INT NOT NULL,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id),
        FOREIGN KEY (sender_id) REFERENCES users(id)
    )");

    if ($action === 'ensure_conversation') {
        $userId = $data['userId'] ?? '';
        $participantId = $data['participantId'] ?? '';
        $projectId = $data['projectId'] ?? null;

        if (!$userId || !$participantId) {
            json_response(['ok' => false, 'error' => 'IDs inválidos'], 400);
            exit;
        }

        // Check if conversation exists between these two
        // Simple approach: find common conversation
        $sql = "
            SELECT c.id 
            FROM conversations c
            JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
            JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
            WHERE cp1.user_id = ? AND cp2.user_id = ?
        ";
        $params = [$userId, $participantId];
        
        if ($projectId) {
            $sql .= " AND c.project_id = ?";
            $params[] = $projectId;
        } else {
             $sql .= " AND c.project_id IS NULL";
        }

        $stmt = $pdo->prepare($sql . " LIMIT 1");
        $stmt->execute($params);
        $conv = $stmt->fetch();

        if ($conv) {
            json_response(['ok' => true, 'conversationId' => $conv['id']]);
            exit;
        }

        // Create new
        $stmt = $pdo->prepare("INSERT INTO conversations (project_id, created_at) VALUES (?, NOW())");
        $stmt->execute([$projectId]);
        $convId = $pdo->lastInsertId();

        $stmt = $pdo->prepare("INSERT INTO conversation_participants (conversation_id, user_id, last_read_at) VALUES (?, ?, NOW()), (?, ?, NOW())");
        $stmt->execute([$convId, $userId, $convId, $participantId]);

        json_response(['ok' => true, 'conversationId' => $convId]);
        exit;
    }

    if ($action === 'list_conversations') {
        $userId = $data['userId'] ?? '';
        if (!$userId) { json_response(['ok' => false, 'error' => 'ID inválido'], 400); exit; }

        $stmt = $pdo->prepare("
            SELECT c.id, c.project_id, p.titulo as project_title,
                   (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
                   (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
                   (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.created_at > COALESCE(cp.last_read_at, '1970-01-01')) as unread_count,
                   u.id as participant_id, u.nome as participant_name, u.email as participant_email
            FROM conversations c
            JOIN conversation_participants cp ON c.id = cp.conversation_id
            LEFT JOIN projects p ON c.project_id = p.id
            JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id != ?
            JOIN users u ON cp2.user_id = u.id
            WHERE cp.user_id = ?
            ORDER BY last_message_time DESC
        ");
        $stmt->execute([$userId, $userId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $conversations = [];
        foreach ($rows as $r) {
            $conversations[] = [
                'id' => $r['id'],
                'projectId' => $r['project_id'],
                'projectTitle' => $r['project_title'],
                'participantId' => $r['participant_id'],
                'participantName' => $r['participant_name'] ?: $r['participant_email'], // Fallback name
                'lastMessage' => $r['last_message'] ?: 'Inicie a conversa',
                'lastMessageTime' => $r['last_message_time'],
                'unreadCount' => (int)$r['unread_count']
            ];
        }

        json_response(['ok' => true, 'conversations' => $conversations]);
        exit;
    }

    if ($action === 'get_messages') {
        $conversationId = $data['conversationId'] ?? '';
        $userId = $data['userId'] ?? '';

        if (!$conversationId || !$userId) { json_response(['ok' => false, 'error' => 'Dados inválidos'], 400); exit; }

        // Verify participation
        $stmt = $pdo->prepare("SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?");
        $stmt->execute([$conversationId, $userId]);
        if (!$stmt->fetch()) {
            json_response(['ok' => false, 'error' => 'Acesso negado'], 403);
            exit;
        }

        // Mark as read
        $pdo->prepare("UPDATE conversation_participants SET last_read_at = NOW() WHERE conversation_id = ? AND user_id = ?")->execute([$conversationId, $userId]);

        $stmt = $pdo->prepare("
            SELECT m.id, m.sender_id, m.content, m.created_at, u.nome as sender_name
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = ?
            ORDER BY m.created_at ASC
        ");
        $stmt->execute([$conversationId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $messages = [];
        foreach ($rows as $r) {
            $messages[] = [
                'id' => $r['id'],
                'senderId' => $r['sender_id'],
                'senderName' => $r['sender_name'],
                'content' => $r['content'],
                'timestamp' => $r['created_at'],
                'read' => true // Simplified
            ];
        }

        json_response(['ok' => true, 'messages' => $messages]);
        exit;
    }

    if ($action === 'send_message') {
        $conversationId = $data['conversationId'] ?? '';
        $userId = $data['userId'] ?? '';
        $content = $data['content'] ?? '';

        if (!$conversationId || !$userId || !$content) { json_response(['ok' => false, 'error' => 'Dados inválidos'], 400); exit; }

        // Verify participation
        $stmt = $pdo->prepare("SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?");
        $stmt->execute([$conversationId, $userId]);
        if (!$stmt->fetch()) {
            json_response(['ok' => false, 'error' => 'Acesso negado'], 403);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$conversationId, $userId, $content]);
        $msgId = $pdo->lastInsertId();

        // Notify other participants
        $stmt = $pdo->prepare("SELECT user_id FROM conversation_participants WHERE conversation_id = ? AND user_id != ?");
        $stmt->execute([$conversationId, $userId]);
        $others = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($others as $otherId) {
            $notifSql = "INSERT INTO notifications (user_id, type, title, description, link, created_at, is_read) VALUES (?, 'message', 'Nova Mensagem', ?, ?, NOW(), 0)";
            $pdo->prepare($notifSql)->execute([$otherId, substr($content, 0, 50) . '...', "/messages?conversation=$conversationId"]);
        }

        json_response(['ok' => true, 'message' => [
            'id' => $msgId,
            'senderId' => $userId,
            'content' => $content,
            'timestamp' => date('Y-m-d H:i:s'),
            'read' => false
        ]]);
        exit;
    }

    json_response(['ok' => false, 'error' => 'Ação inválida'], 400);

} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Erro interno: ' . $e->getMessage()], 500);
}

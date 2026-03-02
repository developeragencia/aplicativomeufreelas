<?php
require_once __DIR__ . '/db.php';
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
        freelancer_id INT NOT NULL,
        client_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_message TEXT,
        last_message_at DATETIME
    )");
    
    $pdo->exec("CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT NOT NULL,
        sender_id INT NOT NULL,
        content TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    if ($action === 'ensure_conversation') {
        $projectId = $data['projectId'] ?? null;
        $freelancerId = $data['freelancerId'] ?? null;
        $clientId = $data['clientId'] ?? null;
        
        if (!$freelancerId || !$clientId) {
            json_response(['ok' => false, 'error' => 'Missing participants'], 400);
        }
        
        // Check existing
        $stmt = $pdo->prepare("SELECT id FROM conversations WHERE freelancer_id = ? AND client_id = ? AND (project_id = ? OR project_id IS NULL) LIMIT 1");
        $stmt->execute([$freelancerId, $clientId, $projectId]);
        $conv = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($conv) {
            json_response(['ok' => true, 'conversationId' => $conv['id']]);
        }
        
        // Create new
        $stmt = $pdo->prepare("INSERT INTO conversations (project_id, freelancer_id, client_id, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$projectId, $freelancerId, $clientId]);
        json_response(['ok' => true, 'conversationId' => $pdo->lastInsertId()]);
    }
    
    if ($action === 'list_conversations') {
        $userId = $data['userId'] ?? 0;
        if (!$userId) json_response(['ok' => false, 'error' => 'Missing userId'], 400);
        
        $stmt = $pdo->prepare("
            SELECT c.*, 
                   u_client.name as client_name, u_client.avatar as client_avatar,
                   u_free.name as freelancer_name, u_free.avatar as freelancer_avatar,
                   p.title as project_title
            FROM conversations c
            LEFT JOIN users u_client ON c.client_id = u_client.id
            LEFT JOIN users u_free ON c.freelancer_id = u_free.id
            LEFT JOIN projects p ON c.project_id = p.id
            WHERE c.client_id = ? OR c.freelancer_id = ?
            ORDER BY c.updated_at DESC
        ");
        $stmt->execute([$userId, $userId]);
        $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format for frontend
        $result = array_map(function($c) use ($userId) {
            $isClient = $c['client_id'] == $userId;
            return [
                'id' => $c['id'],
                'projectId' => $c['project_id'],
                'projectTitle' => $c['project_title'],
                'otherUser' => [
                    'id' => $isClient ? $c['freelancer_id'] : $c['client_id'],
                    'name' => $isClient ? $c['freelancer_name'] : $c['client_name'],
                    'avatar' => $isClient ? $c['freelancer_avatar'] : $c['client_avatar']
                ],
                'lastMessage' => $c['last_message'],
                'updatedAt' => $c['updated_at']
            ];
        }, $conversations);
        
        json_response(['ok' => true, 'conversations' => $result]);
    }

    if ($action === 'get_messages') {
        $conversationId = $data['conversationId'] ?? 0;
        if (!$conversationId) json_response(['ok' => false, 'error' => 'Missing conversationId'], 400);
        
        $stmt = $pdo->prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC");
        $stmt->execute([$conversationId]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        json_response(['ok' => true, 'messages' => $messages]);
    }

    if ($action === 'send_message') {
        $conversationId = $data['conversationId'] ?? 0;
        $senderId = $data['senderId'] ?? 0;
        $content = $data['content'] ?? '';
        
        if (!$conversationId || !$senderId || !$content) json_response(['ok' => false, 'error' => 'Missing data'], 400);
        
        $stmt = $pdo->prepare("INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$conversationId, $senderId, $content]);
        
        // Update conversation last message
        $stmt = $pdo->prepare("UPDATE conversations SET last_message = ?, last_message_at = NOW() WHERE id = ?");
        $stmt->execute([substr($content, 0, 100), $conversationId]);
        
        json_response(['ok' => true]);
    }

    json_response(['ok' => false, 'error' => 'Invalid action'], 400);

} catch (PDOException $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 500);
}

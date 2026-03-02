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

    if ($action === 'create_proposal') {
        $projectId = $data['projectId'] ?? '';
        $freelancerId = $data['freelancerId'] ?? '';
        $amount = $data['amount'] ?? '';
        $deliveryDays = $data['deliveryDays'] ?? '';
        $message = $data['message'] ?? '';

        if (!$projectId || !$freelancerId || !$amount) {
            json_response(['ok' => false, 'error' => 'Dados incompletos'], 400);
            exit;
        }

        // Check if project exists and is open
        $stmt = $pdo->prepare("SELECT status, cliente_id, titulo FROM projects WHERE id = ?");
        $stmt->execute([$projectId]);
        $project = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$project) {
            json_response(['ok' => false, 'error' => 'Projeto não encontrado'], 404);
            exit;
        }

        if ($project['status'] !== 'Aberto') {
            json_response(['ok' => false, 'error' => 'Projeto não aceita mais propostas'], 400);
            exit;
        }

        // Check if already proposed
        $stmt = $pdo->prepare("SELECT id FROM proposals WHERE project_id = ? AND freelancer_id = ?");
        $stmt->execute([$projectId, $freelancerId]);
        if ($stmt->fetch()) {
            json_response(['ok' => false, 'error' => 'Você já enviou uma proposta para este projeto'], 400);
            exit;
        }

        // Insert proposal
        $sql = "INSERT INTO proposals (project_id, freelancer_id, valor, prazo_entrega, mensagem, status, created_at) VALUES (?, ?, ?, ?, ?, 'Pendente', NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$projectId, $freelancerId, $amount, $deliveryDays, $message]);
        $proposalId = $pdo->lastInsertId();

        // Create notification for client
        $notifSql = "INSERT INTO notifications (user_id, type, title, description, link, created_at, is_read) VALUES (?, 'project', 'Nova Proposta', ?, ?, NOW(), 0)";
        $pdo->prepare($notifSql)->execute([
            $project['cliente_id'],
            "Nova proposta recebida para o projeto '{$project['titulo']}'",
            "/project/$projectId"
        ]);

        json_response(['ok' => true, 'proposal' => [
            'id' => $proposalId,
            'projectId' => $projectId,
            'freelancerId' => $freelancerId,
            'value' => $amount,
            'deliveryDays' => $deliveryDays,
            'message' => $message,
            'status' => 'Pendente',
            'createdAt' => date('c')
        ]]);
        exit;
    }

    if ($action === 'list_proposals') {
        $projectId = $data['projectId'] ?? null;
        $freelancerId = $data['freelancerId'] ?? null;
        $clientId = $data['clientId'] ?? null; // List proposals for projects owned by client

        $sql = "
            SELECT p.id, p.project_id, p.freelancer_id, p.valor, p.prazo_entrega, p.mensagem, p.status, p.created_at,
                   proj.titulo as projectTitle, proj.status as projectStatus, proj.cliente_id,
                   u.email as freelancerEmail,
                   COALESCE(pf.titulo, u.email) as freelancerName,
                   COALESCE(pc.nome, uc.email) as clientName
            FROM proposals p
            JOIN projects proj ON p.project_id = proj.id
            JOIN users u ON p.freelancer_id = u.id
            LEFT JOIN profiles_freelancer pf ON u.id = pf.user_id
            JOIN users uc ON proj.cliente_id = uc.id
            LEFT JOIN profiles_cliente pc ON uc.id = pc.user_id
            WHERE 1=1
        ";
        $params = [];

        if ($projectId) {
            $sql .= " AND p.project_id = ?";
            $params[] = $projectId;
        }
        if ($freelancerId) {
            $sql .= " AND p.freelancer_id = ?";
            $params[] = $freelancerId;
        }
        if ($clientId) {
            $sql .= " AND proj.cliente_id = ?";
            $params[] = $clientId;
        }

        $sql .= " ORDER BY p.created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $proposals = [];
        foreach ($rows as $row) {
            $proposals[] = [
                'id' => $row['id'],
                'projectId' => $row['project_id'],
                'projectTitle' => $row['projectTitle'],
                'projectStatus' => $row['projectStatus'],
                'clientId' => $row['cliente_id'],
                'clientName' => $row['clientName'],
                'freelancerId' => $row['freelancer_id'],
                'freelancerName' => $row['freelancerName'],
                'value' => $row['valor'],
                'deliveryDays' => $row['prazo_entrega'],
                'message' => $row['mensagem'],
                'status' => $row['status'], // Pendente, Aceita, Recusada
                'createdAt' => $row['created_at']
            ];
        }

        json_response(['ok' => true, 'proposals' => $proposals]);
        exit;
    }

    if ($action === 'update_proposal_status') {
        $proposalId = $data['proposalId'] ?? '';
        $newStatus = $data['status'] ?? ''; // Aceita, Recusada
        $clientId = $data['clientId'] ?? ''; // For verification

        if (!$proposalId || !in_array($newStatus, ['Aceita', 'Recusada'])) {
            json_response(['ok' => false, 'error' => 'Status inválido'], 400);
            exit;
        }

        // Verify ownership (client of project)
        $stmt = $pdo->prepare("
            SELECT p.id, p.project_id, proj.cliente_id, proj.titulo, p.freelancer_id
            FROM proposals p
            JOIN projects proj ON p.project_id = proj.id
            WHERE p.id = ?
        ");
        $stmt->execute([$proposalId]);
        $prop = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$prop) {
            json_response(['ok' => false, 'error' => 'Proposta não encontrada'], 404);
            exit;
        }

        // If client verification needed (optional but recommended)
        if ($clientId && $prop['cliente_id'] != $clientId) {
            json_response(['ok' => false, 'error' => 'Acesso negado'], 403);
            exit;
        }

        // Update status
        $stmt = $pdo->prepare("UPDATE proposals SET status = ? WHERE id = ?");
        $stmt->execute([$newStatus, $proposalId]);

        // If accepted, close project or mark as In_Progress?
        // Usually, accepting a proposal starts the project.
        if ($newStatus === 'Aceita') {
            $stmt = $pdo->prepare("UPDATE projects SET status = 'In_Progress' WHERE id = ?");
            $stmt->execute([$prop['project_id']]);
            
            // Reject other proposals? Optional.
        }

        // Notify freelancer
        $notifSql = "INSERT INTO notifications (user_id, type, title, description, link, created_at, is_read) VALUES (?, 'proposal', ?, ?, ?, NOW(), 0)";
        $pdo->prepare($notifSql)->execute([
            $prop['freelancer_id'],
            "Sua proposta foi $newStatus",
            "A proposta para o projeto '{$prop['titulo']}' foi $newStatus.",
            "/my-proposals"
        ]);

        json_response(['ok' => true, 'message' => "Proposta $newStatus com sucesso"]);
        exit;
    }

    json_response(['ok' => false, 'error' => 'Ação inválida'], 400);

} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Erro interno: ' . $e->getMessage()], 500);
}

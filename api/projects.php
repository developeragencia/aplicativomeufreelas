<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
  json_response(['ok' => false, 'error' => 'Método não permitido'], 405);
  exit;
}

try {
  $pdo = db_get_pdo();
  $raw = file_get_contents('php://input');
  $data = json_decode($raw ?: '{}', true);
  if (!is_array($data)) $data = [];
  $action = $data['action'] ?? '';

  $notify = function (int $userId, string $type, string $title, string $desc, ?string $link = null) use ($pdo): void {
    try {
      $pdo->prepare("INSERT INTO notifications (user_id, tipo, titulo, descricao, link) VALUES (?, ?, ?, ?, ?)")
          ->execute([$userId, $type, $title, $desc, $link]);
    } catch (Throwable $e) {}
  };

  $allowedStatuses = [
    'Awaiting_Approval',
    'Open',
    'Awaiting_Payment',
    'In_Progress',
    'Awaiting_Release',
    'Closed',
    'Rejected',
    'Disputed'
  ];

  $getProject = function (PDO $pdo, $id) {
    $stmt = $pdo->prepare("SELECT p.id, p.titulo, p.categoria, p.subcategoria, p.nivel, p.status, p.created_at, p.cliente_id AS client_id, pc.nome AS client_name, p.descricao FROM projects p LEFT JOIN profiles_cliente pc ON pc.user_id = p.cliente_id WHERE p.id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch();
  };

  if ($action === 'list_projects') {
    $status = $data['status'] ?? null;
    $clientId = $data['clientId'] ?? null;
    $freelancerId = $data['freelancerId'] ?? null;
    $params = [];
    $where = [];
    
    $sql = "SELECT p.id, p.titulo, p.categoria, p.subcategoria, p.nivel, p.status, p.created_at, p.cliente_id AS client_id, pc.nome AS client_name, p.descricao FROM projects p LEFT JOIN profiles_cliente pc ON pc.user_id = p.cliente_id";

    if ($freelancerId) {
        $sql .= " JOIN proposals prop ON p.id = prop.project_id";
        $where[] = "prop.freelancer_id = ?";
        $params[] = $freelancerId;
        $where[] = "prop.status = 'Aceita'";
    }

    if ($status) { $where[] = 'p.status = ?'; $params[] = $status; }
    if ($clientId) { $where[] = 'p.cliente_id = ?'; $params[] = $clientId; }
    
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY p.created_at DESC LIMIT 100';
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    json_response(['ok' => true, 'projects' => $rows]);
    exit;
  }

  if ($action === 'approve_project') {
    $projectId = $data['projectId'] ?? null;
    if (!is_numeric($projectId)) { json_response(['ok' => false, 'error' => 'Projeto inválido'], 400); exit; }
    $pdo->prepare("UPDATE projects SET status = 'Open', approved_at = NOW() WHERE id = ?")->execute([(int)$projectId]);
    $proj = $getProject($pdo, (int)$projectId);
    if ($proj && isset($proj['client_id'])) $notify((int)$proj['client_id'], 'project', 'Projeto aprovado', 'Seu projeto foi aprovado e está público.', "/project/{$proj['id']}");
    json_response(['ok' => true, 'project' => $proj]);
    exit;
  }

  if ($action === 'reject_project') {
    $projectId = $data['projectId'] ?? null;
    $reason = trim((string)($data['reason'] ?? ''));
    if (!is_numeric($projectId)) { json_response(['ok' => false, 'error' => 'Projeto inválido'], 400); exit; }
    // Opcional: persistir reason em tabela própria de moderação no futuro
    $pdo->prepare("UPDATE projects SET status = 'Rejected', closed_at = NOW() WHERE id = ?")->execute([(int)$projectId]);
    $proj = $getProject($pdo, (int)$projectId);
    if ($proj && isset($proj['client_id'])) $notify((int)$proj['client_id'], 'project', 'Projeto reprovado', 'Seu projeto foi reprovado pela moderação.', "/projects");
    json_response(['ok' => true, 'project' => $proj, 'reason' => $reason]);
    exit;
  }

  if ($action === 'set_status') {
    $projectId = $data['projectId'] ?? null;
    $status = $data['status'] ?? '';
    if (!is_numeric($projectId) || !in_array($status, $allowedStatuses, true)) {
      json_response(['ok' => false, 'error' => 'Dados inválidos'], 400); exit;
    }
    $pdo->prepare("UPDATE projects SET status = ? WHERE id = ?")->execute([$status, (int)$projectId]);
    $proj = $getProject($pdo, (int)$projectId);
    json_response(['ok' => true, 'project' => $proj]);
    exit;
  }

  if ($action === 'close_project') {
    $projectId = $data['projectId'] ?? null;
    if (!is_numeric($projectId)) { json_response(['ok' => false, 'error' => 'Projeto inválido'], 400); exit; }
    $pdo->prepare("UPDATE projects SET status = 'Closed', closed_at = NOW() WHERE id = ?")->execute([(int)$projectId]);
    $proj = $getProject($pdo, (int)$projectId);
    json_response(['ok' => true, 'project' => $proj]);
    exit;
  }

  if ($action === 'reopen_project') {
    $projectId = $data['projectId'] ?? null;
    if (!is_numeric($projectId)) { json_response(['ok' => false, 'error' => 'Projeto inválido'], 400); exit; }
    $pdo->prepare("UPDATE projects SET status = 'Open', closed_at = NULL WHERE id = ?")->execute([(int)$projectId]);
    $proj = $getProject($pdo, (int)$projectId);
    json_response(['ok' => true, 'project' => $proj]);
    exit;
  }

  if ($action === 'cancel_project') {
    $projectId = $data['projectId'] ?? null;
    if (!is_numeric($projectId)) { json_response(['ok' => false, 'error' => 'Projeto inválido'], 400); exit; }
    // Se estiver em andamento, abre disputa; caso contrário apenas fecha
    $stmt = $pdo->prepare("SELECT status FROM projects WHERE id = ?");
    $stmt->execute([(int)$projectId]);
    $row = $stmt->fetch();
    if ($row && $row['status'] === 'In_Progress') {
      $pdo->prepare("UPDATE projects SET status = 'Disputed' WHERE id = ?")->execute([(int)$projectId]);
      $pdo->prepare("INSERT INTO disputes (project_id, opened_at, etapa_atual) VALUES (?, NOW(), 'agreement_window')")->execute([(int)$projectId]);
    } else {
      $pdo->prepare("UPDATE projects SET status = 'Closed', closed_at = NOW() WHERE id = ?")->execute([(int)$projectId]);
    }
    $proj = $getProject($pdo, (int)$projectId);
    // Notify accepted freelancer, if any
    try {
      $st = $pdo->prepare("SELECT freelancer_id FROM proposals WHERE project_id = ? AND status = 'Accepted' ORDER BY id DESC LIMIT 1");
      $st->execute([(int)$projectId]);
      $r = $st->fetch();
      if ($r) $notify((int)$r['freelancer_id'], 'project', 'Projeto cancelado', 'O cliente cancelou o projeto. Verifique a disputa ou mensagens.', "/project/{$projectId}");
      if ($proj && isset($proj['client_id'])) $notify((int)$proj['client_id'], 'project', 'Projeto cancelado', 'Você cancelou o projeto.', "/project/{$projectId}");
    } catch (Throwable $e) {}
    json_response(['ok' => true, 'project' => $proj]);
    exit;
  }

  json_response(['ok' => false, 'error' => 'Ação inválida'], 400);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha de servidor'], 500);
}

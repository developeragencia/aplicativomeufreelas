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
    $stmt = $pdo->prepare("SELECT id, titulo, categoria, subcategoria, nivel, status, created_at, client_id, client_name, descricao, budget FROM projects WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch();
  };

  if ($action === 'list_projects') {
    $status = $data['status'] ?? null;
    $clientId = $data['clientId'] ?? null;
    $params = [];
    $where = [];
    if ($status) { $where[] = 'status = ?'; $params[] = $status; }
    if ($clientId) { $where[] = 'client_id = ?'; $params[] = $clientId; }
    $sql = "SELECT id, titulo, categoria, subcategoria, nivel, status, created_at, client_id, client_name, descricao, budget FROM projects";
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY created_at DESC LIMIT 100';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    json_response(['ok' => true, 'projects' => $rows]);
    exit;
  }

  if ($action === 'approve_project') {
    $projectId = $data['projectId'] ?? null;
    if (!is_numeric($projectId)) { json_response(['ok' => false, 'error' => 'Projeto inválido'], 400); exit; }
    $pdo->prepare("UPDATE projects SET status = 'Open', approved_at = NOW() WHERE id = ?")->execute([(int)$projectId]);
    $proj = $getProject($pdo, (int)$projectId);
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
    json_response(['ok' => true, 'project' => $proj]);
    exit;
  }

  json_response(['ok' => false, 'error' => 'Ação inválida'], 400);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha de servidor'], 500);
}


<?php
require_once __DIR__ . '/../db.php';
$pdo = db_get_pdo();
$id = isset($_GET['id']) ? trim((string)$_GET['id']) : null;

function sanitize_project_description(string $text): string {
  // Remove telefones
  $text = preg_replace('/\(?\d{2}\)?[\s\-]?\d{4,5}[\s\-]?\d{4}/', '', $text);
  $text = preg_replace('/\+?55[\s\-]?\d{2}[\s\-]?\d{4,5}[\s\-]?\d{4}/', '', $text);
  // Remove emails
  $text = preg_replace('/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/', '', $text);
  // Remove URLs
  $text = preg_replace('/https?:\/\/[^\s]+/i', '', $text);
  $text = preg_replace('/www\.[^\s]+/i', '', $text);
  // Mascara valores monetários específicos
  $text = preg_replace('/R?\$?\s*\d{1,3}(\.\d{3})*,\d{2}/', '[VALOR REMOVIDO]', $text);
  return $text;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw ?: '{}', true);
  $userId = isset($data['userId']) ? (string)$data['userId'] : '';
  $title = isset($data['title']) ? trim((string)$data['title']) : '';
  $description = isset($data['description']) ? trim((string)$data['description']) : '';
  $category = isset($data['category']) ? trim((string)$data['category']) : '';
  $subcategory = isset($data['subcategory']) ? trim((string)$data['subcategory']) : null;
  $skills = isset($data['skills']) && is_array($data['skills']) ? json_encode(array_values($data['skills'])) : json_encode([]);
  $experience = isset($data['experienceLevel']) ? (string)$data['experienceLevel'] : 'intermediate';
  $proposalDays = isset($data['proposalDays']) ? (string)$data['proposalDays'] : '30';
  $visibility = isset($data['visibility']) ? (string)$data['visibility'] : 'public';
  if ($title === '' || strlen($title) < 3 || $description === '' || $category === '') {
    json_response(['ok' => false, 'error' => 'Dados inválidos'], 400);
    exit;
  }
  $description = sanitize_project_description($description);
  try {
    // Alinha com o schema criado em setup.php
    // cliente_id, habilidades (JSON), privacidade
    $stmt = $pdo->prepare("INSERT INTO projects (cliente_id, titulo, descricao, categoria, subcategoria, habilidades, nivel, privacidade, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Awaiting_Approval', NOW())");
    $stmt->execute([(int)$userId, $title, $description, $category, $subcategory, $skills, $experience, $visibility === 'private' ? 'private' : 'public']);
    $newId = $pdo->lastInsertId();
    $created = [
      'id' => $newId,
      'titulo' => $title,
      'descricao' => $description,
      'categoria' => $category,
      'subcategoria' => $subcategory,
      'nivel' => $experience,
      'status' => 'Aguardando aprovação',
      'created_at' => date('Y-m-d H:i:s'),
      'client_id' => $userId,
    ];
    json_response(['ok' => true, 'item' => $created]);
    exit;
  } catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Falha ao criar projeto'], 500);
    exit;
  }
}
if ($id) {
  try {
    $stmt = $pdo->prepare("SELECT 
      p.id,
      p.titulo,
      p.categoria,
      p.subcategoria,
      p.nivel,
      p.status,
      p.created_at,
      p.cliente_id AS client_id,
      pc.nome AS client_name,
      p.descricao
      FROM projects p
      LEFT JOIN profiles_cliente pc ON pc.user_id = p.cliente_id
      WHERE p.id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
  } catch (Throwable $e) {
    $stmt = $pdo->prepare("SELECT id, titulo, categoria, subcategoria, nivel, status, created_at, cliente_id AS client_id, NULL AS client_name, descricao FROM projects WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
  }
  if (!$row) {
    json_response(['ok' => false, 'error' => 'Not found'], 404);
    exit;
  }
  json_response(['ok' => true, 'item' => $row]);
  exit;
}
$page = max(1, intval($_GET['page'] ?? 1));
$per = max(1, min(50, intval($_GET['per_page'] ?? 12)));
$offset = ($page - 1) * $per;
try {
  $params = [];
  $where = [];
  $category = $_GET['category'] ?? null;
  $level = $_GET['level'] ?? null;
  $status = $_GET['status'] ?? null;
  $clientId = $_GET['client_id'] ?? null;
  $freelancerId = $_GET['freelancer_id'] ?? null;
  if ($category) { $where[] = 'categoria = ?'; $params[] = $category; }
  if ($level) { $where[] = 'nivel = ?'; $params[] = $level; }
  if ($status) { $where[] = 'status = ?'; $params[] = $status; }
  if ($clientId) { $where[] = 'cliente_id = ?'; $params[] = $clientId; }
  
  $joinProposals = '';
  if ($freelancerId) {
      $joinProposals = " JOIN proposals prop ON prop.project_id = p.id ";
      $where[] = "prop.freelancer_id = ? AND prop.status = 'Accepted'";
      $params[] = $freelancerId;
  }

  $sqlWhere = $where ? ('WHERE ' . implode(' AND ', $where)) : '';
  $sort = $_GET['sort'] ?? 'recent';
  switch ($sort) {
    case 'relevance':
    case 'newest':
    case 'recent':
      $order = 'ORDER BY created_at DESC';
      break;
    case 'oldest':
      $order = 'ORDER BY created_at ASC';
      break;
    case 'alpha_asc':
      $order = 'ORDER BY titulo ASC';
      break;
    case 'alpha_desc':
      $order = 'ORDER BY titulo DESC';
      break;
    default:
      $order = 'ORDER BY created_at DESC';
  }
  $queryWithJoin = "
    SELECT 
      p.id,
      p.titulo,
      p.categoria,
      p.subcategoria,
      p.nivel,
      p.status,
      p.created_at,
      p.cliente_id AS client_id,
      pc.nome AS client_name,
      p.descricao
    FROM projects p
    LEFT JOIN profiles_cliente pc ON pc.user_id = p.cliente_id
    {$joinProposals}
    {$sqlWhere}
    {$order}
    LIMIT {$per} OFFSET {$offset}
  ";
  $querySimple = "
    SELECT id, titulo, categoria, subcategoria, nivel, status, created_at, cliente_id AS client_id, NULL AS client_name, descricao
    FROM projects
    $sqlWhere
    $order
    LIMIT ? OFFSET ?
  ";
  try {
    $stmt = $pdo->prepare($queryWithJoin);
    $stmt->execute(array_merge($params, [$per, $offset]));
  } catch (Throwable $e) {
    $limit = max(1, (int)$per);
    $off = max(0, (int)$offset);
    $queryWithJoin = str_replace('LIMIT ? OFFSET ?', "LIMIT $limit OFFSET $off", $queryWithJoin);
    $querySimple = str_replace('LIMIT ? OFFSET ?', "LIMIT $limit OFFSET $off", $querySimple);
    try {
      $stmt = $pdo->prepare($queryWithJoin);
      $stmt->execute($params);
    } catch (Throwable $e) {
      $stmt = $pdo->prepare($querySimple);
      $stmt->execute($params);
    }
  }
  $items = $stmt->fetchAll();
  $total = 0;
  try {
    $countStmt = $pdo->prepare("SELECT COUNT(*) AS c FROM projects $sqlWhere");
    $countStmt->execute($params);
    $total = intval($countStmt->fetch()['c'] ?? 0);
  } catch (Throwable $e) {
    $total = count($items);
  }
  json_response(['ok' => true, 'items' => $items, 'page' => $page, 'per_page' => $per, 'total' => $total]);
} catch (Throwable $fatal) {
  json_response(['ok' => true, 'items' => [], 'page' => $page, 'per_page' => $per, 'total' => 0]);
}

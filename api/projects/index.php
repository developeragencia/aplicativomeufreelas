<?php
require_once __DIR__ . '/../db.php';
$pdo = db_get_pdo();
$id = isset($_GET['id']) ? trim((string)$_GET['id']) : null;
if ($id) {
  $stmt = $pdo->prepare("SELECT 
    p.id, p.titulo, p.categoria, p.subcategoria, p.nivel, p.status, p.created_at, p.approved_at, 
    p.client_id, COALESCE(pc.nome, p.client_name) AS client_name, p.descricao, p.budget
    FROM projects p
    LEFT JOIN profiles_cliente pc ON pc.user_id = p.client_id
    WHERE p.id = ?");
  $stmt->execute([$id]);
  $row = $stmt->fetch();
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
$params = [];
$where = [];
$category = $_GET['category'] ?? null;
$level = $_GET['level'] ?? null;
$status = $_GET['status'] ?? 'Open';
if ($category) { $where[] = 'categoria = ?'; $params[] = $category; }
if ($level) { $where[] = 'nivel = ?'; $params[] = $level; }
if ($status) { $where[] = 'status = ?'; $params[] = $status; }
$sqlWhere = $where ? ('WHERE ' . implode(' AND ', $where)) : '';
$sort = $_GET['sort'] ?? 'recent';
switch ($sort) {
  case 'relevance':
    $order = 'ORDER BY approved_at DESC, created_at DESC';
    break;
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
$stmt = $pdo->prepare("
  SELECT 
    p.id, p.titulo, p.categoria, p.subcategoria, p.nivel, p.status, p.created_at, p.approved_at,
    p.client_id, COALESCE(pc.nome, p.client_name) AS client_name, p.descricao, p.budget
  FROM projects p
  LEFT JOIN profiles_cliente pc ON pc.user_id = p.client_id
  $sqlWhere
  $order
  LIMIT ? OFFSET ?
");
$stmt->execute(array_merge($params, [$per, $offset]));
$items = $stmt->fetchAll();
$countStmt = $pdo->prepare("SELECT COUNT(*) AS c FROM projects $sqlWhere");
$countStmt->execute($params);
$total = intval($countStmt->fetch()['c'] ?? 0);
json_response(['ok' => true, 'items' => $items, 'page' => $page, 'per_page' => $per, 'total' => $total]);

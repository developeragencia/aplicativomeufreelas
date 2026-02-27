<?php
require_once __DIR__ . '/../db.php';
$pdo = db_get_pdo();
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
$order = $sort === 'relevance' ? 'ORDER BY approved_at DESC, created_at DESC' : 'ORDER BY created_at DESC';
$stmt = $pdo->prepare("
  SELECT id, titulo, categoria, subcategoria, nivel, status, created_at, approved_at
  FROM projects
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

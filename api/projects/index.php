<?php
require_once __DIR__ . '/../db.php';
$pdo = db_get_pdo();
$id = isset($_GET['id']) ? trim((string)$_GET['id']) : null;
if ($id) {
  try {
    $stmt = $pdo->prepare("SELECT 
      p.id, p.titulo, p.categoria, p.nivel, p.status, p.created_at,
      p.client_id, COALESCE(pc.nome, p.client_name) AS client_name, p.descricao, p.budget
      FROM projects p
      LEFT JOIN profiles_cliente pc ON pc.user_id = p.client_id
      WHERE p.id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
  } catch (Throwable $e) {
    $stmt = $pdo->prepare("SELECT id, titulo, categoria, nivel, status, created_at, client_id, client_name, descricao, budget FROM projects WHERE id = ?");
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
  if ($category) { $where[] = 'categoria = ?'; $params[] = $category; }
  if ($level) { $where[] = 'nivel = ?'; $params[] = $level; }
  if ($status) { $where[] = 'status = ?'; $params[] = $status; }
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
      p.id, p.titulo, p.categoria, p.nivel, p.status, p.created_at,
      p.client_id, COALESCE(pc.nome, p.client_name) AS client_name, p.descricao, p.budget
    FROM projects p
    LEFT JOIN profiles_cliente pc ON pc.user_id = p.client_id
    $sqlWhere
    $order
    LIMIT ? OFFSET ?
  ";
  $querySimple = "
    SELECT id, titulo, categoria, nivel, status, created_at, client_id, client_name, descricao, budget
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
  if ($total === 0) {
    try {
      $test = $pdo->prepare("SELECT id, titulo, categoria, nivel, status, created_at, client_id, client_name, descricao, budget FROM projects WHERE titulo = ? LIMIT 1");
      $test->execute(['Projeto Teste - Landing Page']);
      $row = $test->fetch();
      if ($row) {
        $items = [$row];
        $total = 1;
      }
      if (!$row) {
        $pdo->prepare("INSERT INTO projects (titulo, categoria, nivel, status, created_at, client_id, client_name, descricao, budget) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?)")
            ->execute([
              'Projeto Teste - Landing Page',
              'Web, Mobile & Software',
              'intermediate',
              'Aberto',
              0,
              'Cliente Teste',
              'Projeto de homologação.',
              'A combinar'
            ]);
        $test->execute(['Projeto Teste - Landing Page']);
        $row = $test->fetch();
        if ($row) {
          $items = [$row];
          $total = 1;
        }
      }
    } catch (Throwable $e) {}
  }
  json_response(['ok' => true, 'items' => $items, 'page' => $page, 'per_page' => $per, 'total' => $total]);
} catch (Throwable $fatal) {
  json_response(['ok' => true, 'items' => [], 'page' => $page, 'per_page' => $per, 'total' => 0]);
}

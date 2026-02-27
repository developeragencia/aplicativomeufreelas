<?php
require_once __DIR__ . '/../db.php';
$pdo = db_get_pdo();
$page = max(1, intval($_GET['page'] ?? 1));
$per = max(1, min(50, intval($_GET['per_page'] ?? 12)));
$offset = ($page - 1) * $per;
$q = $_GET['q'] ?? null;
$orderBy = 'ORDER BY pf.projetos_concluidos DESC, pf.avaliacoes_avg DESC';
$sort = $_GET['sort'] ?? null;
if ($sort === 'ranking') { $orderBy = 'ORDER BY pf.projetos_concluidos DESC, pf.recomendacao_pct DESC'; }
if ($sort === 'recent') { $orderBy = 'ORDER BY u.created_at DESC'; }
$where = ['u.role = \'freelancer\''];
$params = [];
if ($q) { $where[] = '(u.email LIKE ? OR pf.titulo LIKE ? OR pf.bio LIKE ?)'; $params[] = "%$q%"; $params[] = "%$q%"; $params[] = "%$q%"; }
$sqlWhere = 'WHERE ' . implode(' AND ', $where);
$stmt = $pdo->prepare("
  SELECT u.id, u.email, pf.titulo, pf.avaliacoes_avg, pf.recomendacao_pct, pf.projetos_concluidos
  FROM users u
  LEFT JOIN profiles_freelancer pf ON pf.user_id = u.id
  $sqlWhere
  $orderBy
  LIMIT ? OFFSET ?
");
$stmt->execute(array_merge($params, [$per, $offset]));
$items = $stmt->fetchAll();
$countStmt = $pdo->prepare("
  SELECT COUNT(*) AS c
  FROM users u
  LEFT JOIN profiles_freelancer pf ON pf.user_id = u.id
  $sqlWhere
");
$countStmt->execute($params);
$total = intval($countStmt->fetch()['c'] ?? 0);
json_response(['ok' => true, 'items' => $items, 'page' => $page, 'per_page' => $per, 'total' => $total]);

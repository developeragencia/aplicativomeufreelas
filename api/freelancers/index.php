<?php
require_once __DIR__ . '/../db.php';
$pdo = db_get_pdo();
$id = isset($_GET['id']) ? trim((string)$_GET['id']) : null;
$page = max(1, intval($_GET['page'] ?? 1));
$per = max(1, min(50, intval($_GET['per_page'] ?? 12)));
$offset = ($page - 1) * $per;
$keyword = trim((string)($_GET['q'] ?? ''));
$ratingMin = isset($_GET['rating_min']) ? floatval($_GET['rating_min']) : null;

$where = ["u.role = 'freelancer'", "u.status = 'active'"];
$params = [];
if ($keyword !== '') {
  $where[] = "(pf.titulo LIKE ? OR pf.bio LIKE ? OR u.email LIKE ?)";
  $kw = '%' . $keyword . '%';
  $params[] = $kw; $params[] = $kw; $params[] = $kw;
}
if ($ratingMin !== null) {
  $where[] = "pf.avaliacoes_avg >= ?";
  $params[] = $ratingMin;
}
$sqlWhere = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

if ($id) {
  $stmt = $pdo->prepare("
    SELECT
      u.id,
      u.email,
      pf.titulo,
      pf.bio,
      pf.habilidades,
      pf.avaliacoes_avg,
      pf.projetos_concluidos,
      pf.recomendacao_pct
    FROM users u
    LEFT JOIN profiles_freelancer pf ON pf.user_id = u.id
    WHERE u.id = ?
    LIMIT 1
  ");
  $stmt->execute([$id]);
  $r = $stmt->fetch();
  if (!$r) {
    json_response(['ok' => false, 'error' => 'Not found'], 404);
    exit;
  }
  $skills = [];
  if (!empty($r['habilidades'])) {
    $decoded = json_decode($r['habilidades'], true);
    if (is_array($decoded)) $skills = array_values(array_filter($decoded, fn($v) => is_string($v)));
  }
  $email = (string)$r['email'];
  $username = explode('@', $email)[0];
  $displayName = (string)($r['titulo'] ?? $username);
  $item = [
    'id' => (string)$r['id'],
    'name' => $displayName,
    'username' => $username,
    'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($displayName) . '&background=003366&color=fff',
    'title' => (string)($r['titulo'] ?? ''),
    'bio' => (string)($r['bio'] ?? ''),
    'skills' => $skills,
    'rating' => floatval($r['avaliacoes_avg'] ?? 0),
    'totalReviews' => 0,
    'completedProjects' => intval($r['projetos_concluidos'] ?? 0),
    'recommendations' => intval($r['recomendacao_pct'] ?? 0),
    'memberSince' => '',
    'ranking' => 0,
    'isPremium' => false,
    'isPro' => false,
    'isVerified' => false,
    'city' => null,
    'state' => null,
    'country' => null,
    'isOnline' => null
  ];
  json_response(['ok' => true, 'item' => $item]);
  exit;
}

$stmt = $pdo->prepare("
  SELECT
    u.id,
    u.email,
    pf.titulo,
    pf.bio,
    pf.habilidades,
    pf.avaliacoes_avg,
    pf.projetos_concluidos,
    pf.recomendacao_pct
  FROM users u
  LEFT JOIN profiles_freelancer pf ON pf.user_id = u.id
  $sqlWhere
  ORDER BY pf.avaliacoes_avg DESC, u.id DESC
  LIMIT ? OFFSET ?
");
$stmt->execute(array_merge($params, [$per, $offset]));
$rows = $stmt->fetchAll();

$countStmt = $pdo->prepare("
  SELECT COUNT(*) AS c
  FROM users u
  LEFT JOIN profiles_freelancer pf ON pf.user_id = u.id
  $sqlWhere
");
$countStmt->execute($params);
$total = intval($countStmt->fetch()['c'] ?? 0);

$items = [];
foreach ($rows as $r) {
  $skills = [];
  if (!empty($r['habilidades'])) {
    $decoded = json_decode($r['habilidades'], true);
    if (is_array($decoded)) $skills = array_values(array_filter($decoded, fn($v) => is_string($v)));
  }
  $email = (string)$r['email'];
  $username = explode('@', $email)[0];
  $displayName = (string)($r['titulo'] ?? $username);
  $items[] = [
    'id' => (string)$r['id'],
    'name' => $displayName,
    'username' => $username,
    'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($displayName) . '&background=003366&color=fff',
    'title' => (string)($r['titulo'] ?? ''),
    'bio' => (string)($r['bio'] ?? ''),
    'skills' => $skills,
    'rating' => floatval($r['avaliacoes_avg'] ?? 0),
    'totalReviews' => 0,
    'completedProjects' => intval($r['projetos_concluidos'] ?? 0),
    'recommendations' => intval($r['recomendacao_pct'] ?? 0),
    'memberSince' => '',
    'ranking' => 0,
    'isPremium' => false,
    'isPro' => false,
    'isVerified' => false,
    'city' => null,
    'state' => null,
    'country' => null,
    'isOnline' => null
  ];
}

json_response(['ok' => true, 'items' => $items, 'page' => $page, 'per_page' => $per, 'total' => $total]);

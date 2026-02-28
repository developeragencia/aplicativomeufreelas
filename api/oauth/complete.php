<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../_env.php';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') { json_response(['ok' => false, 'error' => 'Método não permitido'], 405); exit; }
$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!is_array($data)) $data = $_POST;
$email = $data['email'] ?? null;
if (!is_string($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) { json_response(['ok' => false, 'error' => 'Dados inválidos'], 400); exit; }
function load_user_payload(PDO $pdo, int $userId): array {
  $stmt = $pdo->prepare('SELECT id, email, role, active_role FROM users WHERE id = ? LIMIT 1');
  $stmt->execute([$userId]);
  $u = $stmt->fetch();
  $stmt2 = $pdo->prepare('SELECT role FROM user_accounts WHERE user_id = ?');
  $stmt2->execute([$userId]);
  $hasClient = false; $hasFreelancer = false;
  foreach ($stmt2->fetchAll() as $r) { if ($r['role'] === 'client') $hasClient = true; if ($r['role'] === 'freelancer') $hasFreelancer = true; }
  $active = $u['active_role'] ?: $u['role'];
  $name = $u['email'];
  if ($active === 'client') {
    $stmt3 = $pdo->prepare('SELECT nome FROM profiles_cliente WHERE user_id = ? LIMIT 1');
    $stmt3->execute([$userId]);
    $p = $stmt3->fetch();
    if ($p && !empty($p['nome'])) $name = $p['nome'];
  } else {
    $stmt3 = $pdo->prepare('SELECT titulo FROM profiles_freelancer WHERE user_id = ? LIMIT 1');
    $stmt3->execute([$userId]);
    $p = $stmt3->fetch();
    if ($p && !empty($p['titulo'])) $name = $p['titulo'];
  }
  return ['id' => (int)$u['id'], 'email' => $u['email'], 'name' => $name, 'type' => $active, 'hasClientAccount' => $hasClient, 'hasFreelancerAccount' => $hasFreelancer];
}
try {
  $pdo = db_get_pdo();
  $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $u = $stmt->fetch();
  if (!$u) { json_response(['ok' => false, 'error' => 'Usuário não encontrado'], 404); exit; }
  $user = load_user_payload($pdo, (int)$u['id']);
  json_response(['ok' => true, 'user' => $user]);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha de conexão com o servidor'], 500);
}

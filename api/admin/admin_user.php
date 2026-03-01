<?php
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$token = isset($_GET['token']) ? (string)$_GET['token'] : '';
$tokenFile = __DIR__ . '/../.deploy_token';
if (!file_exists($tokenFile) || $token === '' || trim(file_get_contents($tokenFile)) === '' || !hash_equals(trim(file_get_contents($tokenFile)), $token)) {
  http_response_code(403);
  echo '<h3>Acesso negado</h3><p>Token inválido.</p>';
  exit;
}

function upsert_admin(PDO $pdo, string $email, string $password): array {
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) return ['ok' => false, 'error' => 'E-mail inválido'];
  if (strlen($password) < 8) return ['ok' => false, 'error' => 'Senha deve ter 8+ caracteres'];
  $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $existing = $stmt->fetchColumn();
  $hash = password_hash($password, PASSWORD_DEFAULT);
  if ($existing) {
    $pdo->prepare('UPDATE users SET role = ?, password_hash = ?, status = ? WHERE id = ?')->execute(['admin', $hash, 'active', (int)$existing]);
    return ['ok' => true, 'id' => (int)$existing, 'email' => $email, 'updated' => true];
  }
  $pdo->prepare('INSERT INTO users (role, email, password_hash, status) VALUES (?, ?, ?, ?)')->execute(['admin', $email, $hash, 'active']);
  return ['ok' => true, 'id' => (int)$pdo->lastInsertId(), 'email' => $email, 'created' => true];
}

if ($method === 'POST') {
  $payload = $_POST ?: json_decode(file_get_contents('php://input') ?: '[]', true);
  $email = (string)($payload['email'] ?? '');
  $password = (string)($payload['password'] ?? '');
  try {
    $pdo = db_get_pdo();
    $res = upsert_admin($pdo, $email, $password);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($res);
  } catch (Throwable $e) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Falha']);
  }
  exit;
}

$email = isset($_GET['email']) ? (string)$_GET['email'] : '';
$password = isset($_GET['password']) ? (string)$_GET['password'] : '';
if ($email !== '' && $password !== '') {
  try {
    $pdo = db_get_pdo();
    $res = upsert_admin($pdo, $email, $password);
    header('Content-Type: text/plain; charset=utf-8');
    echo $res['ok'] ? 'OK: ' . ($res['created'] ?? false ? 'Criado' : 'Atualizado') . ' - ' . $res['email'] : ('ERRO: ' . $res['error']);
  } catch (Throwable $e) {
    header('Content-Type: text/plain; charset=utf-8');
    echo 'ERRO';
  }
  exit;
}

?>
<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8" />
    <title>Admin - Criar/Atualizar</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: system-ui, Arial; padding: 24px; max-width: 520px; margin: 0 auto; }
      label { display: block; margin: 12px 0 4px; }
      input[type="email"], input[type="password"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
      button { margin-top: 16px; padding: 10px 14px; background: #0ea5e9; border: 0; border-radius: 6px; color: #fff; cursor: pointer; }
      .hint { color: #555; font-size: 12px; margin-top: 8px; }
      .ok { color: #065f46; }
      .err { color: #991b1b; }
    </style>
  </head>
  <body>
    <h2>Criar/Atualizar Usuário Admin</h2>
    <form method="post" action="?token=<?php echo htmlspecialchars($token); ?>">
      <label>E-mail</label>
      <input type="email" name="email" required placeholder="admin@seudominio.com">
      <label>Senha (8+ caracteres)</label>
      <input type="password" name="password" required placeholder="SuaSenhaForte#2026">
      <button type="submit">Aplicar</button>
      <p class="hint">Dica: para uso rápido via GET: ?token=...&email=...&password=...</p>
    </form>
  </body>
  </html>

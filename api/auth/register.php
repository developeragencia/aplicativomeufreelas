<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../_env.php';
require_once __DIR__ . '/../vendor/autoload.php';
use App\Mailer;

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
  json_response(['ok' => false, 'error' => 'Método não permitido'], 405);
  exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!is_array($data)) $data = $_POST;

$role = $data['role'] ?? ($data['type'] ?? null);
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
$name = $data['name'] ?? null;

if (!in_array($role, ['client','freelancer'], true) || !is_string($email) || !is_string($password) || !is_string($name)) {
  json_response(['ok' => false, 'error' => 'Dados inválidos'], 400);
  exit;
}

try {
  $pdo = db_get_pdo();
  // Verifica se usuário (identidade) já existe
  $stmt = $pdo->prepare('SELECT id, password_hash, active_role FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $existing = $stmt->fetch();
  if ($existing) {
    // senha deve conferir com a conta existente
    if (!password_verify($password, $existing['password_hash'])) {
      json_response(['ok' => false, 'error' => 'Este e-mail já está cadastrado. Faça login.', 'code' => 'EMAIL_EXISTS_WRONG_PASSWORD'], 409);
      exit;
    }
    // cria conta secundária se ainda não existir
    $stmt2 = $pdo->prepare('SELECT 1 FROM user_accounts WHERE user_id = ? AND role = ?');
    $stmt2->execute([(int)$existing['id'], $role]);
    if ($stmt2->fetch()) {
      json_response(['ok' => false, 'error' => 'Este e-mail já possui conta ativa. Faça login.', 'code' => 'EMAIL_ROLE_EXISTS'], 409);
      exit;
    }
    $pdo->prepare('INSERT INTO user_accounts (user_id, role) VALUES (?, ?)')->execute([(int)$existing['id'], $role]);
    // cria perfil se necessário
    if ($role === 'client') {
      $stmt3 = $pdo->prepare('SELECT 1 FROM profiles_cliente WHERE user_id = ?');
      $stmt3->execute([(int)$existing['id']]);
      if (!$stmt3->fetch()) {
        $pdo->prepare('INSERT INTO profiles_cliente (user_id, nome) VALUES (?, ?)')->execute([(int)$existing['id'], $name]);
      }
    } else {
      $stmt3 = $pdo->prepare('SELECT 1 FROM profiles_freelancer WHERE user_id = ?');
      $stmt3->execute([(int)$existing['id']]);
      if (!$stmt3->fetch()) {
        $pdo->prepare('INSERT INTO profiles_freelancer (user_id, titulo, bio) VALUES (?, ?, ?)')->execute([(int)$existing['id'], $name, '']);
        $pdo->prepare('INSERT INTO connections_wallet (freelancer_id, saldo_plano_mensal, saldo_medalha_bonus, saldo_nao_expiravel) VALUES (?, 0, 0, 0)')->execute([(int)$existing['id']]);
        $pdo->prepare('INSERT INTO plans (freelancer_id, tipo_plano, modalidade, inicio, status) VALUES (?, ?, ?, ?, ?)')->execute([(int)$existing['id'], 'basic', 'compra', date('Y-m-d'), 'active']);
      }
    }
    $pdo->prepare('UPDATE users SET active_role = ? WHERE id = ?')->execute([$role, (int)$existing['id']]);
    $user = ['id' => (int)$existing['id'], 'email' => $email, 'name' => $name, 'type' => $role];
  } else {
    // cria identidade e primeira conta
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $pdo->prepare('INSERT INTO users (role, email, password_hash, active_role) VALUES (?, ?, ?, ?)')->execute([$role, $email, $hash, $role]);
    $userId = (int)$pdo->lastInsertId();
    $pdo->prepare('INSERT INTO user_accounts (user_id, role) VALUES (?, ?)')->execute([$userId, $role]);
    if ($role === 'client') {
      $pdo->prepare('INSERT INTO profiles_cliente (user_id, nome) VALUES (?, ?)')->execute([$userId, $name]);
    } else {
      $pdo->prepare('INSERT INTO profiles_freelancer (user_id, titulo, bio) VALUES (?, ?, ?)')->execute([$userId, $name, '']);
      $pdo->prepare('INSERT INTO connections_wallet (freelancer_id, saldo_plano_mensal, saldo_medalha_bonus, saldo_nao_expiravel) VALUES (?, 0, 0, 0)')->execute([$userId]);
      $pdo->prepare('INSERT INTO plans (freelancer_id, tipo_plano, modalidade, inicio, status) VALUES (?, ?, ?, ?, ?)')->execute([$userId, 'basic', 'compra', date('Y-m-d'), 'active']);
    }
    $user = ['id' => $userId, 'email' => $email, 'name' => $name, 'type' => $role];
  }

  $subject = 'Bem-vindo ao MeuFreelas';
  $html = '<p>Olá, ' . htmlspecialchars($name) . '!</p><p>Conta criada com sucesso como ' . htmlspecialchars($role) . '.</p><p>Acesse: <a href="' . (env('FRONTEND_URL', 'https://meufreelas.com.br')) . '/auth">Entrar</a></p>';
  Mailer::send($email, $name, $subject, $html);

  json_response(['ok' => true, 'user' => $user]);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha de conexão com o servidor'], 500);
}

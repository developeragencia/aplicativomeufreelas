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
  $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  if ($stmt->fetch()) {
    json_response(['ok' => false, 'error' => 'Este email já está cadastrado.', 'code' => 'EMAIL_EXISTS'], 409);
    exit;
  }

  $hash = password_hash($password, PASSWORD_DEFAULT);
  $pdo->prepare('INSERT INTO users (role, email, password_hash) VALUES (?, ?, ?)')->execute([$role, $email, $hash]);
  $userId = (int)$pdo->lastInsertId();

  if ($role === 'client') {
    $pdo->prepare('INSERT INTO profiles_cliente (user_id, nome) VALUES (?, ?)')->execute([$userId, $name]);
  } else {
    $pdo->prepare('INSERT INTO profiles_freelancer (user_id, titulo, bio) VALUES (?, ?, ?)')->execute([$userId, $name, '']);
    $pdo->prepare('INSERT INTO connections_wallet (freelancer_id, saldo_plano_mensal, saldo_medalha_bonus, saldo_nao_expiravel) VALUES (?, 0, 0, 0)')->execute([$userId]);
    $pdo->prepare('INSERT INTO plans (freelancer_id, tipo_plano, modalidade, inicio, status) VALUES (?, ?, ?, ?, ?)')->execute([$userId, 'basic', 'compra', date('Y-m-d'), 'active']);
  }

  $subject = 'Bem-vindo ao MeuFreelas';
  $html = '<p>Olá, ' . htmlspecialchars($name) . '!</p><p>Conta criada com sucesso como ' . htmlspecialchars($role) . '.</p><p>Acesse: <a href="' . (env('FRONTEND_URL', 'https://meufreelas.com.br')) . '/login">Login</a></p>';
  Mailer::send($email, $name, $subject, $html);

  json_response(['ok' => true, 'user' => ['id' => $userId, 'email' => $email, 'name' => $name, 'type' => $role]]);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha de conexão com o servidor'], 500);
}

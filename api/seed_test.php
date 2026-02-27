<?php
require_once __DIR__ . '/db.php';

function unauthorized() {
  json_response(['ok' => false, 'error' => 'Não autorizado'], 403);
  exit;
}

$token = isset($_GET['token']) ? (string)$_GET['token'] : '';
$tokenFile = __DIR__ . '/.deploy_token';
if (!is_string($token) || $token === '' || !file_exists($tokenFile)) unauthorized();
$serverToken = trim(file_get_contents($tokenFile));
if ($serverToken === '' || !hash_equals($serverToken, $token)) unauthorized();

$action = isset($_GET['cleanup']) ? 'cleanup' : 'seed';

try {
  $pdo = db_get_pdo();
  $pdo->beginTransaction();

  if ($action === 'seed') {
    // Ensure client user
    $clientEmail = 'cliente.teste@meufreelas.com.br';
    $clientName = 'Cliente Teste';
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$clientEmail]);
    $clientId = $stmt->fetchColumn();
    if (!$clientId) {
      $hash = password_hash('Senha123!', PASSWORD_DEFAULT);
      $pdo->prepare('INSERT INTO users (role, email, password_hash) VALUES (?, ?, ?)')->execute(['client', $clientEmail, $hash]);
      $clientId = (int)$pdo->lastInsertId();
      $pdo->prepare('INSERT INTO profiles_cliente (user_id, nome) VALUES (?, ?)')->execute([$clientId, $clientName]);
    } else {
      $clientId = (int)$clientId;
      $pdo->prepare('UPDATE profiles_cliente SET nome = ? WHERE user_id = ?')->execute([$clientName, $clientId]);
    }

    // Ensure freelancer user
    $freelEmail = 'freelancer.teste@meufreelas.com.br';
    $freelTitle = 'Freelancer Teste';
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$freelEmail]);
    $freelId = $stmt->fetchColumn();
    if (!$freelId) {
      $hash = password_hash('Senha123!', PASSWORD_DEFAULT);
      $pdo->prepare('INSERT INTO users (role, email, password_hash) VALUES (?, ?, ?)')->execute(['freelancer', $freelEmail, $hash]);
      $freelId = (int)$pdo->lastInsertId();
      $pdo->prepare('INSERT INTO profiles_freelancer (user_id, titulo, bio) VALUES (?, ?, ?)')->execute([$freelId, $freelTitle, 'Profissional para testes do sistema.']);
      $pdo->prepare('INSERT INTO connections_wallet (freelancer_id, saldo_plano_mensal, saldo_medalha_bonus, saldo_nao_expiravel) VALUES (?, 0, 0, 0)')->execute([$freelId]);
      $pdo->prepare('INSERT INTO plans (freelancer_id, tipo_plano, modalidade, inicio, status) VALUES (?, ?, ?, ?, ?)')->execute([$freelId, 'basic', 'compra', date('Y-m-d'), 'active']);
    } else {
      $freelId = (int)$freelId;
      $pdo->prepare('UPDATE profiles_freelancer SET titulo = ? WHERE user_id = ?')->execute([$freelTitle, $freelId]);
    }

    // Ensure test project
    $projTitle = 'Projeto Teste - Landing Page';
    $stmt = $pdo->prepare('SELECT id FROM projects WHERE client_id = ? AND titulo = ? LIMIT 1');
    $stmt->execute([$clientId, $projTitle]);
    $projId = $stmt->fetchColumn();
    if (!$projId) {
      $pdo->prepare('INSERT INTO projects (client_id, client_name, titulo, descricao, categoria, subcategoria, nivel, status, budget, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())')
          ->execute([$clientId, $clientName, $projTitle, 'Criar uma landing page moderna para campanha, com formulário e integração básica.', 'Web, Mobile & Software', 'Landing Page', 'intermediate', 'Open', 'Aberto']);
      $projId = (int)$pdo->lastInsertId();
    } else {
      $projId = (int)$projId;
    }

    $pdo->commit();
    json_response(['ok' => true, 'clientId' => $clientId, 'freelancerId' => $freelId, 'projectId' => $projId, 'message' => 'Dados de teste semeados']);
  } else {
    // Cleanup test data
    // Remove projects first
    $pdo->prepare('DELETE FROM projects WHERE client_id IN (SELECT id FROM users WHERE email IN (?, ?))')->execute(['cliente.teste@meufreelas.com.br', 'freelancer.teste@meufreelas.com.br']);
    // Optionally remove users
    if (isset($_GET['delete_users'])) {
      $pdo->prepare('DELETE FROM profiles_cliente WHERE user_id IN (SELECT id FROM users WHERE email = ?)')->execute(['cliente.teste@meufreelas.com.br']);
      $pdo->prepare('DELETE FROM profiles_freelancer WHERE user_id IN (SELECT id FROM users WHERE email = ?)')->execute(['freelancer.teste@meufreelas.com.br']);
      $pdo->prepare('DELETE FROM users WHERE email IN (?, ?)')->execute(['cliente.teste@meufreelas.com.br', 'freelancer.teste@meufreelas.com.br']);
    }
    $pdo->commit();
    json_response(['ok' => true, 'message' => 'Dados de teste removidos']);
  }
} catch (Throwable $e) {
  if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
  json_response(['ok' => false, 'error' => 'Erro ao semear dados: ' . $e->getMessage()], 500);
}

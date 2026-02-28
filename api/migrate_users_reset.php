<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/_env.php';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$tokenHeader = null;
if (!empty($_SERVER['HTTP_X_MIGRATION_TOKEN'])) $tokenHeader = $_SERVER['HTTP_X_MIGRATION_TOKEN'];
if (!empty($_SERVER['HTTP_AUTHORIZATION']) && stripos($_SERVER['HTTP_AUTHORIZATION'], 'Bearer ') === 0) {
  $tokenHeader = trim(substr($_SERVER['HTTP_AUTHORIZATION'], 7));
}
$token = $_POST['token'] ?? ($_GET['token'] ?? $tokenHeader);
$action = $_POST['action'] ?? ($_GET['action'] ?? 'migrate');
$allow = env('MIGRATION_ALLOW_DROP', '0') === '1';
if ($action === 'status') {
  json_response([
    'ok' => true,
    'allow_drop' => $allow,
    'requires_token' => true,
    'db_name' => env('DB_NAME', ''),
    'env_ok' => !!env('DB_HOST', '') && !!env('DB_USER', '')
  ]);
  exit;
}
if (!$allow || !is_string($token) || $token !== env('MIGRATION_TOKEN', '')) {
  json_response(['ok' => false, 'error' => 'Não autorizado', 'code' => 'UNAUTHORIZED'], 401);
  exit;
}
try {
  $pdo = db_get_pdo();
  if ($action === 'dry_run') {
    // Testa permissões de CREATE/DROP sem afetar tabelas reais
    try {
      $pdo->exec('CREATE TABLE IF NOT EXISTS __mf_tmp (id INT PRIMARY KEY AUTO_INCREMENT)');
      $pdo->exec('DROP TABLE __mf_tmp');
      json_response(['ok' => true, 'message' => 'Dry run OK: CREATE/DROP permitido']);
    } catch (Throwable $e) {
      json_response(['ok' => false, 'error' => 'Dry run falhou: ' . $e->getMessage()], 500);
    }
    exit;
  }
  $pdo->exec('SET FOREIGN_KEY_CHECKS = 0');
  // Drop dependentes primeiro
  $pdo->exec('DROP TABLE IF EXISTS user_accounts');
  $pdo->exec('DROP TABLE IF EXISTS profiles_cliente');
  $pdo->exec('DROP TABLE IF EXISTS profiles_freelancer');
  $pdo->exec('DROP TABLE IF EXISTS connections_wallet');
  $pdo->exec('DROP TABLE IF EXISTS plans');
  // Drop users
  $pdo->exec('DROP TABLE IF EXISTS users');
  $pdo->exec('SET FOREIGN_KEY_CHECKS = 1');
  // Recria conforme setup.php
  $queries = [
    "CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      role ENUM('client','freelancer','admin') NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      active_role ENUM('client','freelancer') NULL,
      status ENUM('active','blocked') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login_at TIMESTAMP NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
    "CREATE TABLE IF NOT EXISTS user_accounts (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      user_id BIGINT UNSIGNED NOT NULL,
      role ENUM('client','freelancer') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_user_role (user_id, role),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
    "CREATE TABLE IF NOT EXISTS profiles_cliente (
      user_id BIGINT UNSIGNED PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      empresa VARCHAR(255) NULL,
      cpf_cnpj VARCHAR(32) NULL,
      telefone VARCHAR(32) NULL,
      localizacao VARCHAR(255) NULL,
      preferencias TEXT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
    "CREATE TABLE IF NOT EXISTS profiles_freelancer (
      user_id BIGINT UNSIGNED PRIMARY KEY,
      titulo VARCHAR(255) NULL,
      bio TEXT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
    "CREATE TABLE IF NOT EXISTS connections_wallet (
      freelancer_id BIGINT UNSIGNED PRIMARY KEY,
      saldo_plano_mensal INT DEFAULT 0,
      saldo_medalha_bonus INT DEFAULT 0,
      saldo_nao_expiravel INT DEFAULT 0,
      renovacao_em DATE NULL,
      FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
    "CREATE TABLE IF NOT EXISTS plans (
      freelancer_id BIGINT UNSIGNED PRIMARY KEY,
      tipo_plano ENUM('basic','pro','premium') NOT NULL,
      modalidade ENUM('compra','assinatura') NOT NULL,
      inicio DATE NOT NULL,
      fim DATE NULL,
      renovacao ENUM('monthly','none') DEFAULT 'monthly',
      status ENUM('active','expired','canceled') NOT NULL,
      gateway_sub_id VARCHAR(128) NULL,
      FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
  ];
  foreach ($queries as $q) { $pdo->exec($q); }
  json_response(['ok' => true, 'message' => 'Tabela users e dependências recriadas']);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => $e->getMessage()], 500);
}

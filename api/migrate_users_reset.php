<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/_env.php';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') { json_response(['ok' => false, 'error' => 'Método não permitido'], 405); exit; }
$token = $_POST['token'] ?? ($_GET['token'] ?? null);
$allow = env('MIGRATION_ALLOW_DROP', '0') === '1';
if (!$allow || !is_string($token) || $token !== env('MIGRATION_TOKEN', '')) {
  json_response(['ok' => false, 'error' => 'Não autorizado'], 401);
  exit;
}
try {
  $pdo = db_get_pdo();
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
      preferencias JSON NULL,
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

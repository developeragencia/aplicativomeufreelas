<?php
require_once __DIR__ . '/db.php';

function exec_safe(PDO $pdo, string $sql): array {
  try {
    $pdo->exec($sql);
    return ['ok' => true];
  } catch (Throwable $e) {
    return ['ok' => false, 'error' => $e->getMessage()];
  }
}

function ensure_database(): void {
  $host = env('DB_HOST', 'localhost');
  $port = env('DB_PORT', '3306');
  $name = env('DB_NAME', 'meufreelas');
  $user = env('DB_USER', 'root');
  $pass = env('DB_PASS', '');
  try {
    $dsnServer = "mysql:host={$host};port={$port};charset=utf8mb4";
    $serverPdo = new PDO($dsnServer, $user, $pass, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    $serverPdo->exec("CREATE DATABASE IF NOT EXISTS `{$name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
  } catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'DB create failed: ' . $e->getMessage()], 500);
    exit;
  }
}

try {
  $envOk = true;
  $missing = [];
  foreach (['DB_HOST','DB_PORT','DB_NAME','DB_USER','DB_PASS'] as $k) {
    if (!env($k)) { $envOk = false; $missing[] = $k; }
  }
  if (!$envOk) {
    json_response(['ok' => false, 'error' => 'ENV missing', 'missing' => $missing], 500);
    exit;
  }
  $autoCreate = env('DB_AUTO_CREATE', '0') === '1';
  if ($autoCreate) {
    ensure_database();
  }
  $pdo = db_get_pdo();
  $results = [];

  $tables = [
    // users
    "CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      role ENUM('client','freelancer','admin') NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      status ENUM('active','blocked') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login_at TIMESTAMP NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // profiles_cliente
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

    // profiles_freelancer
    "CREATE TABLE IF NOT EXISTS profiles_freelancer (
      user_id BIGINT UNSIGNED PRIMARY KEY,
      titulo VARCHAR(255) NULL,
      bio TEXT NULL,
      areas_interesse JSON NULL,
      habilidades JSON NULL,
      portfolio_count INT DEFAULT 0,
      ranking_cache JSON NULL,
      recomendacao_pct INT DEFAULT 0,
      avaliacoes_avg DECIMAL(3,2) DEFAULT 0,
      projetos_concluidos INT DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // projects
    "CREATE TABLE IF NOT EXISTS projects (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      cliente_id BIGINT UNSIGNED NOT NULL,
      titulo VARCHAR(255) NOT NULL,
      descricao MEDIUMTEXT NOT NULL,
      categoria VARCHAR(100) NULL,
      subcategoria VARCHAR(100) NULL,
      habilidades JSON NULL,
      nivel ENUM('beginner','intermediate','expert') DEFAULT 'beginner',
      privacidade ENUM('public','private') DEFAULT 'public',
      status ENUM('Awaiting_Approval','Open','In_Progress','Disputed','Closed','Rejected','Awaiting_Payment','Awaiting_Release') NOT NULL,
      projeto_original_id BIGINT UNSIGNED NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      approved_at TIMESTAMP NULL,
      closed_at TIMESTAMP NULL,
      FOREIGN KEY (cliente_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (projeto_original_id) REFERENCES projects(id) ON DELETE SET NULL,
      INDEX idx_projects_status (status),
      INDEX idx_projects_cat_status (categoria, status),
      INDEX idx_projects_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // proposals
    "CREATE TABLE IF NOT EXISTS proposals (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      project_id BIGINT UNSIGNED NOT NULL,
      freelancer_id BIGINT UNSIGNED NOT NULL,
      oferta DECIMAL(12,2) NOT NULL,
      oferta_final DECIMAL(12,2) NOT NULL,
      duracao INT NOT NULL,
      detalhes MEDIUMTEXT NOT NULL,
      status ENUM('Submitted','Promoted','Accepted','Rejected','Withdrawn') DEFAULT 'Submitted',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_proposals_project (project_id),
      INDEX idx_proposals_freelancer (freelancer_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // threads
    "CREATE TABLE IF NOT EXISTS threads (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      project_id BIGINT UNSIGNED NOT NULL,
      tipo ENUM('proposal','project','dispute') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      INDEX idx_threads_project (project_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // messages
    "CREATE TABLE IF NOT EXISTS messages (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      thread_id BIGINT UNSIGNED NOT NULL,
      sender_id BIGINT UNSIGNED NOT NULL,
      texto MEDIUMTEXT NOT NULL,
      anexos JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_system TINYINT(1) DEFAULT 0,
      FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_messages_thread (thread_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // payments
    "CREATE TABLE IF NOT EXISTS payments (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      project_id BIGINT UNSIGNED NOT NULL,
      valor DECIMAL(12,2) NOT NULL,
      metodo ENUM('pix','card','paypal') NOT NULL,
      gateway VARCHAR(50) NOT NULL,
      status ENUM('Created','Confirmed','Released','Refunded','Failed') NOT NULL,
      escrow_hold_id VARCHAR(128) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      confirmed_at TIMESTAMP NULL,
      released_at TIMESTAMP NULL,
      refunded_at TIMESTAMP NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      INDEX idx_payments_project (project_id),
      INDEX idx_payments_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // payments_ledger
    "CREATE TABLE IF NOT EXISTS payments_ledger (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      payment_id BIGINT UNSIGNED NULL,
      project_id BIGINT UNSIGNED NULL,
      user_id BIGINT UNSIGNED NULL,
      tipo ENUM('Deposit','Hold','Release','Refund','Fee','Payout') NOT NULL,
      valor DECIMAL(12,2) NOT NULL,
      saldo_escrow DECIMAL(12,2) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_ledger_project (project_id),
      INDEX idx_ledger_payment (payment_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // disputes
    "CREATE TABLE IF NOT EXISTS disputes (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      project_id BIGINT UNSIGNED NOT NULL,
      opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      etapa_atual ENUM('agreement_window','moderation','closed') NOT NULL,
      acordo_proposto JSON NULL,
      decisao_admin ENUM('client','freelancer','partial') NULL,
      encerrada_em TIMESTAMP NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      INDEX idx_disputes_project (project_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // connections_wallet
    "CREATE TABLE IF NOT EXISTS connections_wallet (
      freelancer_id BIGINT UNSIGNED PRIMARY KEY,
      saldo_plano_mensal INT DEFAULT 0,
      saldo_medalha_bonus INT DEFAULT 0,
      saldo_nao_expiravel INT DEFAULT 0,
      renovacao_em DATE NULL,
      FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // connections_ledger
    "CREATE TABLE IF NOT EXISTS connections_ledger (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      freelancer_id BIGINT UNSIGNED NOT NULL,
      project_id BIGINT UNSIGNED NULL,
      tipo ENUM('proposal','question','credit','adjust') NOT NULL,
      delta INT NOT NULL,
      saldo_apos INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
      INDEX idx_conn_ledger_user (freelancer_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // plans
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

    // project_boosts
    "CREATE TABLE IF NOT EXISTS project_boosts (
      project_id BIGINT UNSIGNED PRIMARY KEY,
      tipo ENUM('destaque','urgente') NOT NULL,
      inicio TIMESTAMP NOT NULL,
      fim TIMESTAMP NULL,
      status ENUM('active','expired','canceled') NOT NULL,
      payment_id BIGINT UNSIGNED NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // kyc
    "CREATE TABLE IF NOT EXISTS kyc (
      freelancer_id BIGINT UNSIGNED PRIMARY KEY,
      status ENUM('pending','approved','rejected') NOT NULL,
      docs_urls JSON NULL,
      selfie_url VARCHAR(512) NULL,
      aprovado_em TIMESTAMP NULL,
      reprovado_motivo VARCHAR(255) NULL,
      FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // badges
    "CREATE TABLE IF NOT EXISTS badges (
      freelancer_id BIGINT UNSIGNED PRIMARY KEY,
      identidade_verificada_bool TINYINT(1) DEFAULT 0,
      medalha_tipo ENUM('none','talent','top','top_plus') DEFAULT 'none',
      concedida_em TIMESTAMP NULL,
      proxima_verificacao TIMESTAMP NULL,
      FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // violations
    "CREATE TABLE IF NOT EXISTS violations (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      user_id BIGINT UNSIGNED NOT NULL,
      tipo VARCHAR(100) NOT NULL,
      motivo VARCHAR(255) NOT NULL,
      penalidade_inicio TIMESTAMP NULL,
      penalidade_fim TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      admin_id BIGINT UNSIGNED NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_violations_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

    // audit_log
    "CREATE TABLE IF NOT EXISTS audit_log (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      admin_id BIGINT UNSIGNED NULL,
      acao VARCHAR(100) NOT NULL,
      entidade VARCHAR(100) NOT NULL,
      entidade_id BIGINT UNSIGNED NULL,
      antes JSON NULL,
      depois JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
  ];

  foreach ($tables as $idx => $sql) {
    $res = exec_safe($pdo, $sql);
    $res['index'] = $idx;
    if (!$res['ok'] && strpos(strtolower((string)$res['error']), 'json') !== false) {
      $fallback = exec_safe($pdo, str_replace(' JSON ', ' MEDIUMTEXT ', $sql));
      $fallback['index'] = $idx;
      $fallback['fallback'] = true;
      $res = $fallback;
    }
    $results[] = $res;
  }

  $createdFlags = [];
  foreach ($results as $r) {
    $createdFlags[] = $r['ok'];
  }
  json_response(['ok' => true, 'created' => $createdFlags, 'details' => $results]);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => $e->getMessage()], 500);
}

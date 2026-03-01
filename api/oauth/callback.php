<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../_env.php';
session_start();
$provider = $_GET['provider'] ?? null;
$code = $_GET['code'] ?? null;
$state = $_GET['state'] ?? null;
if (!in_array($provider, ['google','github'], true) || !$code) {
  json_response(['ok' => false, 'error' => 'Parâmetros inválidos'], 400);
  exit;
}
$redirectBase = env('FRONTEND_URL', 'https://meufreelas.com.br');
function http_post_json($url, $params, $headers = []) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
  if (!empty($headers)) curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  $resp = curl_exec($ch);
  curl_close($ch);
  return $resp;
}
function http_get_json($url, $token = null, $headers = []) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  if ($token) {
    $headers[] = "Authorization: Bearer {$token}";
  }
  if (!empty($headers)) curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  $resp = curl_exec($ch);
  curl_close($ch);
  return $resp;
}
try {
  $pdo = db_get_pdo();
  $email = null;
  $name = '';
  if ($provider === 'google') {
    $clientId = env('GOOGLE_CLIENT_ID', '');
    $clientSecret = env('GOOGLE_CLIENT_SECRET', '');
    $redirectUri = env('GOOGLE_REDIRECT_URI', $redirectBase . '/api/oauth/callback.php?provider=google');
    $tokenResp = http_post_json('https://oauth2.googleapis.com/token', [
      'code' => $code,
      'client_id' => $clientId,
      'client_secret' => $clientSecret,
      'redirect_uri' => $redirectUri,
      'grant_type' => 'authorization_code',
    ]);
    $tokenData = json_decode($tokenResp, true);
    if (!is_array($tokenData) || empty($tokenData['access_token'])) {
      header('Location: ' . $redirectBase . '/auth?oauth_error=google');
      exit;
    }
    $userResp = http_get_json('https://www.googleapis.com/oauth2/v2/userinfo', $tokenData['access_token']);
    $userData = json_decode($userResp, true);
    $email = $userData['email'] ?? null;
    $name = $userData['name'] ?? '';
  } else {
    $clientId = env('GITHUB_CLIENT_ID', '');
    $clientSecret = env('GITHUB_CLIENT_SECRET', '');
    $redirectUri = env('GITHUB_REDIRECT_URI', $redirectBase . '/api/oauth/callback.php?provider=github');
    $tokenResp = http_post_json('https://github.com/login/oauth/access_token', [
      'code' => $code,
      'client_id' => $clientId,
      'client_secret' => $clientSecret,
      'redirect_uri' => $redirectUri,
    ], ['Accept: application/json', 'User-Agent: MeuFreelasOAuth']);
    $tokenData = json_decode($tokenResp, true);
    if (empty($tokenData['access_token'])) {
      header('Location: ' . $redirectBase . '/auth?oauth_error=github');
      exit;
    }
    $userResp = http_get_json('https://api.github.com/user/emails', $tokenData['access_token'], ['User-Agent: MeuFreelasOAuth', 'Accept: application/vnd.github+json']);
    $emails = json_decode($userResp, true);
    if (is_array($emails)) {
      foreach ($emails as $it) {
        if (!empty($it['primary'])) { $email = $it['email'] ?? null; break; }
      }
      if (!$email && isset($emails[0]['email'])) $email = $emails[0]['email'];
    }
    $userResp2 = http_get_json('https://api.github.com/user', $tokenData['access_token'], ['User-Agent: MeuFreelasOAuth', 'Accept: application/vnd.github+json']);
    $user2 = json_decode($userResp2, true);
    $name = $user2['name'] ?? ($user2['login'] ?? '');
  }
  if (!$email) {
    header('Location: ' . $redirectBase . '/auth?oauth_error=email');
    exit;
  }
  $stmt = $pdo->prepare('SELECT id, active_role FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $u = $stmt->fetch();
  if (!$u) {
    $hash = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
    $role = 'client';
    $pdo->prepare('INSERT INTO users (role, email, password_hash, active_role) VALUES (?, ?, ?, ?)')->execute([$role, $email, $hash, $role]);
    $userId = (int)$pdo->lastInsertId();
    $pdo->prepare('INSERT INTO user_accounts (user_id, role) VALUES (?, ?)')->execute([$userId, $role]);
    $pdo->prepare('INSERT INTO profiles_cliente (user_id, nome) VALUES (?, ?)')->execute([$userId, $name]);
    $id = $userId;
    // Envia e-mail de boas-vindas via Mailer (fallback)
    if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
      require_once __DIR__ . '/../vendor/autoload.php';
      if (class_exists('App\\Mailer')) { class_alias('App\\Mailer', 'Mailer'); }
    }
    if (!class_exists('Mailer')) {
      require_once __DIR__ . '/../_mailer.php';
    }
    $subject = 'Bem-vindo ao MeuFreelas';
    $html = '<p>Olá, ' . htmlspecialchars($name) . '!</p><p>Conta criada com sucesso via ' . htmlspecialchars($provider) . '.</p><p>Acesse: <a href="' . (env('FRONTEND_URL', 'https://meufreelas.com.br')) . '/login">Entrar</a></p>';
    if (class_exists('Mailer')) { Mailer::send($email, $name, $subject, $html); }
  } else {
    $id = (int)$u['id'];
  }
  header('Location: ' . $redirectBase . '/login?oauth_email=' . urlencode($email) . '&provider=' . urlencode($provider));
  exit;
} catch (Throwable $e) {
  header('Location: ' . $redirectBase . '/auth?oauth_error=server');
  exit;
}

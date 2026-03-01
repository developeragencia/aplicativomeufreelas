<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
  json_response(['ok' => false, 'error' => 'Método não permitido'], 405);
  exit;
}

try {
  $pdo = db_get_pdo();
  $raw = file_get_contents('php://input');
  $data = json_decode($raw ?: '{}', true);
  if (!is_array($data)) $data = [];
  $action = $data['action'] ?? '';

  if ($action === 'submit') {
    $freelancerId = isset($data['freelancer_id']) ? (int)$data['freelancer_id'] : 0;
    $docs = isset($data['docs']) && is_array($data['docs']) ? $data['docs'] : [];
    $selfie = isset($data['selfie']) ? (string)$data['selfie'] : '';
    if ($freelancerId <= 0 || empty($docs) || $selfie === '') {
      json_response(['ok' => false, 'error' => 'Dados inválidos'], 400); exit;
    }
    $docsJson = json_encode($docs, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $stmt = $pdo->prepare("INSERT INTO kyc (freelancer_id, status, docs_urls, selfie_url) VALUES (?, 'pending', ?, ?) ON DUPLICATE KEY UPDATE status = 'pending', docs_urls = VALUES(docs_urls), selfie_url = VALUES(selfie_url), reprovado_motivo = NULL, aprovado_em = NULL");
    $stmt->execute([$freelancerId, $docsJson, $selfie]);
    json_response(['ok' => true]);
    exit;
  }

  if ($action === 'status') {
    $freelancerId = isset($data['freelancer_id']) ? (int)$data['freelancer_id'] : 0;
    if ($freelancerId <= 0) { json_response(['ok' => false, 'error' => 'ID inválido'], 400); exit; }
    $stmt = $pdo->prepare("SELECT freelancer_id, status, docs_urls, selfie_url, aprovado_em, reprovado_motivo FROM kyc WHERE freelancer_id = ? LIMIT 1");
    $stmt->execute([$freelancerId]);
    $row = $stmt->fetch();
    $badgeStmt = $pdo->prepare("SELECT identidade_verificada_bool FROM badges WHERE freelancer_id = ? LIMIT 1");
    $badgeStmt->execute([$freelancerId]);
    $badgeRow = $badgeStmt->fetch();
    $verified = $badgeRow ? (int)$badgeRow['identidade_verificada_bool'] === 1 : false;
    json_response(['ok' => true, 'kyc' => $row ?: null, 'verified' => $verified]);
    exit;
  }

  if ($action === 'admin_review') {
    // Admin-only endpoint in produção: aqui simplificado, sem autenticação
    $freelancerId = isset($data['freelancer_id']) ? (int)$data['freelancer_id'] : 0;
    $decision = $data['decision'] ?? ''; // approve | reject
    $reason = trim((string)($data['reason'] ?? ''));
    if ($freelancerId <= 0 || !in_array($decision, ['approve','reject'], true)) {
      json_response(['ok' => false, 'error' => 'Dados inválidos'], 400); exit;
    }
    if ($decision === 'approve') {
      $pdo->prepare("UPDATE kyc SET status = 'approved', aprovado_em = NOW(), reprovado_motivo = NULL WHERE freelancer_id = ?")->execute([$freelancerId]);
      $pdo->prepare("INSERT INTO badges (freelancer_id, identidade_verificada_bool, medalha_tipo, concedida_em) VALUES (?, 1, 'none', NOW()) ON DUPLICATE KEY UPDATE identidade_verificada_bool = 1, concedida_em = NOW()")->execute([$freelancerId]);
    } else {
      $pdo->prepare("UPDATE kyc SET status = 'rejected', reprovado_motivo = ? WHERE freelancer_id = ?")->execute([$reason, $freelancerId]);
      $pdo->prepare("INSERT INTO badges (freelancer_id, identidade_verificada_bool, medalha_tipo) VALUES (?, 0, 'none') ON DUPLICATE KEY UPDATE identidade_verificada_bool = 0")->execute([$freelancerId]);
    }
    json_response(['ok' => true]);
    exit;
  }

  json_response(['ok' => false, 'error' => 'Ação inválida'], 400);
} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'Falha de servidor'], 500);
}

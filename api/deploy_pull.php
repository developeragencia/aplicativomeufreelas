<?php
require_once __DIR__ . '/_env.php';
require_once __DIR__ . '/db.php';

function respond($ok, $data = []) {
  json_response(array_merge(['ok' => $ok], $data), $ok ? 200 : 400);
  exit;
}

$tokenParam = $_GET['token'] ?? $_POST['token'] ?? '';
$allowedToken = env('DEPLOY_TOKEN', env('TURNSTILE_SECRET_KEY', ''));
if (!$allowedToken || $tokenParam !== $allowedToken) {
  respond(false, ['error' => 'unauthorized']);
}

$repoZip = 'https://github.com/developeragencia/aplicativomeufreelas/archive/refs/heads/main.zip';
$tmpDir = sys_get_temp_dir() . '/mf_deploy_' . uniqid();
$zipPath = $tmpDir . '/repo.zip';
if (!is_dir($tmpDir) && !mkdir($tmpDir, 0775, true)) {
  respond(false, ['error' => 'tmp_unwritable']);
}

function download($url, $dest) {
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 60,
  ]);
  $data = curl_exec($ch);
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($status !== 200 || $data === false) return false;
  return file_put_contents($dest, $data) !== false;
}

if (!download($repoZip, $zipPath)) {
  respond(false, ['error' => 'download_failed']);
}

$zip = new ZipArchive();
if ($zip->open($zipPath) !== true) {
  respond(false, ['error' => 'zip_open_failed']);
}
$extractDir = $tmpDir . '/repo';
mkdir($extractDir, 0775, true);
$zip->extractTo($extractDir);
$zip->close();

// Locate extracted folder (aplicativomeufreelas-main)
$folders = array_values(array_filter(scandir($extractDir), fn($n) => $n !== '.' && $n !== '..' && is_dir($extractDir . '/' . $n)));
if (!$folders) {
  respond(false, ['error' => 'zip_structure_invalid']);
}
$root = $extractDir . '/' . $folders[0];

function rrmdir($dir) {
  if (!is_dir($dir)) return;
  foreach (scandir($dir) as $item) {
    if ($item === '.' || $item === '..') continue;
    $path = $dir . '/' . $item;
    if (is_dir($path)) rrmdir($path); else @unlink($path);
  }
  @rmdir($dir);
}
function rcopy($src, $dst, $exclude = []) {
  if (!is_dir($src)) return false;
  if (!is_dir($dst)) @mkdir($dst, 0775, true);
  $ok = true;
  foreach (scandir($src) as $item) {
    if ($item === '.' || $item === '..') continue;
    $from = $src . '/' . $item;
    $to = $dst . '/' . $item;
    foreach ($exclude as $ex) {
      if (fnmatch($ex, $item)) { $ok = $ok && true; continue 2; }
    }
    if (is_dir($from)) {
      $ok = $ok && rcopy($from, $to, $exclude);
    } else {
      $ok = $ok && copy($from, $to);
    }
  }
  return $ok;
}

// Deploy frontend
$dist = $root . '/app/dist';
$publicRoot = dirname(__DIR__);
if (is_dir($dist)) {
  // Clean old assets to avoid stale files
  @rrmdir($publicRoot . '/assets');
  // Copy dist (index.html + assets)
  if (!rcopy($dist, $publicRoot)) {
    respond(false, ['error' => 'frontend_copy_failed']);
  }
}

// Deploy API (skip env files)
$apiSrc = $root . '/api';
$apiDst = __DIR__;
if (is_dir($apiSrc)) {
  if (!rcopy($apiSrc, $apiDst, ['.env', '.env.*'])) {
    respond(false, ['error' => 'api_copy_failed']);
  }
}

respond(true, ['message' => 'deployed', 'ts' => time()]);

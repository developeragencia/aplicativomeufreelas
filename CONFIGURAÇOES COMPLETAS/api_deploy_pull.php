<?php
require_once __DIR__.'/_env.php';
header('Content-Type: application/json; charset=utf-8');
$token = $_GET['token'] ?? '';
if (!$token || !isset($ENV['DEPLOY_TOKEN']) || $token !== $ENV['DEPLOY_TOKEN']) {
  echo json_encode(['ok'=>false,'error'=>'unauthorized']); exit;
}
$cmd = 'git pull origin main';
$out = [];
$code = 0;
exec($cmd.' 2>&1', $out, $code);
$ok = ($code === 0);
echo json_encode(['ok'=>$ok,'output'=>implode("\n",$out)]);

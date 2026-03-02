<?php
// Token de segurança (o mesmo usado no deploy_pull.php)
$token = 'b7f3e9a2d4c1e8f9a6b2c7d1f4e3a9b5c2d7e1f0a8b6c3d2e9f1a4b8c0d6e2';

if (($_GET['token'] ?? '') !== $token) {
    http_response_code(403);
    die('Access Denied');
}

header('Content-Type: application/json');

$output = [];
$return_var = 0;

// Force fetch and reset
// Ensure we are in the correct directory (optional, but good practice if script is in subfolder)
chdir(__DIR__ . '/..'); 

exec('git fetch --all 2>&1', $output);
exec('git reset --hard origin/main 2>&1', $output);

echo json_encode([
    'ok' => true,
    'output' => $output,
    'ts' => time()
]);

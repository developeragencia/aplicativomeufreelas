<?php
// api_deploy_pull.php - Git Pull Webhook

$secret = getenv('DEPLOY_SECRET') ?: 'mysecret';
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE'] ?? '';

if ($signature) {
    list($algo, $hash) = explode('=', $signature, 2);
    $payload = file_get_contents('php://input');
    $payloadHash = hash_hmac($algo, $payload, $secret);

    if ($hash !== $payloadHash) {
        http_response_code(403);
        die('Invalid signature');
    }
}

// Execute git pull
$output = shell_exec('git pull 2>&1');
echo "<pre>$output</pre>";
?>
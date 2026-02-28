<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../rbac.php';

header('Content-Type: application/json');
cors();

$pdo = db_get_pdo();
$user = auth_get_user($pdo);

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        // Get current balance
        // Assuming connections are stored in user profile or computed from ledger
        // Let's use user table column 'connections' if exists, or sum ledger
        // For now, let's assume we added 'connections' col to users or profiles_freelancer
        // But our schema setup didn't explicitly add it to users table, but `profiles_freelancer` had `connections`? 
        // Let's check schema. `profiles_freelancer` has `ranking_cache`, etc. 
        // Let's use `connections_ledger` to calculate balance dynamically for correctness
        
        $stmt = $pdo->prepare("SELECT SUM(amount) as balance FROM connections_ledger WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $balance = $stmt->fetchColumn() ?: 0;
        
        // Get transactions
        $stmt = $pdo->prepare("
            SELECT id, amount, description, type, created_at as date 
            FROM connections_ledger 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 20
        ");
        $stmt->execute([$user['id']]);
        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format date
        $transactions = array_map(function($t) {
            $t['date'] = date('d/m/Y', strtotime($t['date']));
            return $t;
        }, $transactions);

        echo json_encode([
            'balance' => (int)$balance,
            'max_monthly' => 40, // TODO: Fetch from plan
            'transactions' => $transactions
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Buy connections or spend
    // Action: buy
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';

    if ($action === 'buy') {
        $pack = $input['pack'] ?? 'basic';
        $amount = $pack === 'pro' ? 25 : 10;
        $cost = $pack === 'pro' ? 39.90 : 19.90;
        
        // TODO: Integrate Payment Gateway here
        // For now, simulate success
        
        try {
            $stmt = $pdo->prepare("INSERT INTO connections_ledger (user_id, amount, description, type) VALUES (?, ?, ?, 'refill')");
            $stmt->execute([$user['id'], $amount, "Compra de pacote " . ucfirst($pack)]);
            
            echo json_encode(['ok' => true, 'new_balance' => 'calculated_on_refresh']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

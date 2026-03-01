<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

function plan_limit(PDO $pdo, int $freelancerId): int {
    try {
        $stmt = $pdo->prepare("SELECT tipo_plano FROM plans WHERE freelancer_id = ? AND status = 'active' ORDER BY inicio DESC LIMIT 1");
        $stmt->execute([$freelancerId]);
        $row = $stmt->fetch();
        $tier = $row ? $row['tipo_plano'] : 'basic';
        if ($tier === 'premium') return 240;
        if ($tier === 'pro') return 120;
        return 10;
    } catch (Throwable $e) {
        return 10;
    }
}

function ensure_wallet(PDO $pdo, int $freelancerId): array {
    $stmt = $pdo->prepare("SELECT saldo_plano_mensal, saldo_medalha_bonus, saldo_nao_expiravel, renovacao_em FROM connections_wallet WHERE freelancer_id = ?");
    $stmt->execute([$freelancerId]);
    $row = $stmt->fetch();
    if ($row) return $row;
    $limit = plan_limit($pdo, $freelancerId);
    $renov = date('Y-m-01', strtotime('first day of next month'));
    $pdo->prepare("INSERT INTO connections_wallet (freelancer_id, saldo_plano_mensal, saldo_medalha_bonus, saldo_nao_expiravel, renovacao_em) VALUES (?, ?, 0, 0, ?)")->execute([$freelancerId, $limit, $renov]);
    return ['saldo_plano_mensal' => $limit, 'saldo_medalha_bonus' => 0, 'saldo_nao_expiravel' => 0, 'renovacao_em' => $renov];
}

function refresh_wallet(PDO $pdo, int $freelancerId): array {
    $row = ensure_wallet($pdo, $freelancerId);
    $today = date('Y-m-d');
    if ($row['renovacao_em'] && $today >= $row['renovacao_em']) {
        $limit = plan_limit($pdo, $freelancerId);
        $next = date('Y-m-01', strtotime('first day of next month'));
        $pdo->prepare("UPDATE connections_wallet SET saldo_plano_mensal = ?, saldo_medalha_bonus = 0, renovacao_em = ? WHERE freelancer_id = ?")->execute([$limit, $next, $freelancerId]);
        $row = ['saldo_plano_mensal' => $limit, 'saldo_medalha_bonus' => 0, 'saldo_nao_expiravel' => $row['saldo_nao_expiravel'], 'renovacao_em' => $next];
    }
    return $row;
}

$pdo = db_get_pdo();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $freelancerId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
    if ($freelancerId <= 0) {
        echo json_encode(['balance' => null, 'transactions' => []]);
        exit;
    }
    $w = refresh_wallet($pdo, $freelancerId);
    $total = intval($w['saldo_plano_mensal']) + intval($w['saldo_medalha_bonus']) + intval($w['saldo_nao_expiravel']);
    try {
        $stmt = $pdo->prepare("SELECT id, tipo, delta, saldo_apos, project_id, created_at FROM connections_ledger WHERE freelancer_id = ? ORDER BY created_at DESC LIMIT 30");
        $stmt->execute([$freelancerId]);
        $tx = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Throwable $e) {
        $tx = [];
    }
    echo json_encode([
        'balance' => $total,
        'monthly' => intval($w['saldo_plano_mensal']),
        'bonus' => intval($w['saldo_medalha_bonus']),
        'stock' => intval($w['saldo_nao_expiravel']),
        'renew_at' => $w['renovacao_em'],
        'transactions' => $tx
    ]);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
    if ($action === 'consume') {
        $freelancerId = isset($input['freelancer_id']) ? intval($input['freelancer_id']) : 0;
        $projectId = isset($input['project_id']) ? intval($input['project_id']) : null;
        $kind = $input['kind'] ?? 'proposal';
        $cost = 1;
        if ($freelancerId <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'freelancer_id inválido']);
            exit;
        }
        $w = refresh_wallet($pdo, $freelancerId);
        $m = intval($w['saldo_plano_mensal']);
        $b = intval($w['saldo_medalha_bonus']);
        $s = intval($w['saldo_nao_expiravel']);
        if (($m + $b + $s) < $cost) {
            http_response_code(402);
            echo json_encode(['error' => 'Sem conexões disponíveis']);
            exit;
        }
        if ($m >= $cost) $m -= $cost;
        else if ($b >= $cost) $b -= $cost;
        else $s -= $cost;
        $pdo->prepare("UPDATE connections_wallet SET saldo_plano_mensal = ?, saldo_medalha_bonus = ?, saldo_nao_expiravel = ? WHERE freelancer_id = ?")->execute([$m, $b, $s, $freelancerId]);
        $saldoApos = $m + $b + $s;
        $pdo->prepare("INSERT INTO connections_ledger (freelancer_id, project_id, tipo, delta, saldo_apos) VALUES (?, ?, ?, ?, ?)")->execute([$freelancerId, $projectId, $kind, -$cost, $saldoApos]);
        echo json_encode(['ok' => true, 'balance' => $saldoApos]);
        exit;
    }
    if ($action === 'credit') {
        $freelancerId = isset($input['freelancer_id']) ? intval($input['freelancer_id']) : 0;
        $amount = isset($input['amount']) ? intval($input['amount']) : 0;
        $source = $input['source'] ?? 'credit';
        if ($freelancerId <= 0 || $amount <= 0) { http_response_code(400); echo json_encode(['error' => 'Dados inválidos']); exit; }
        $w = refresh_wallet($pdo, $freelancerId);
        $s = intval($w['saldo_nao_expiravel']) + $amount;
        $pdo->prepare("UPDATE connections_wallet SET saldo_nao_expiravel = ? WHERE freelancer_id = ?")->execute([$s, $freelancerId]);
        $saldoApos = intval($w['saldo_plano_mensal']) + intval($w['saldo_medalha_bonus']) + $s;
        $pdo->prepare("INSERT INTO connections_ledger (freelancer_id, project_id, tipo, delta, saldo_apos) VALUES (?, NULL, ?, ?, ?)")->execute([$freelancerId, $source, $amount, $saldoApos]);
        echo json_encode(['ok' => true, 'balance' => $saldoApos]);
        exit;
    }
    echo json_encode(['error' => 'Ação inválida']);
    exit;
}

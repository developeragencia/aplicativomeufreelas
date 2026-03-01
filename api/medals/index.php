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

// Definitions of all available medals
$all_medals = [
    [
        'slug' => 'iniciante',
        'name' => 'Iniciante',
        'description' => 'Completou o primeiro projeto com sucesso.',
        'icon' => 'Star',
        'color' => 'text-blue-500',
        'bg' => 'bg-blue-100',
    ],
    [
        'slug' => 'top-rated',
        'name' => 'Top Rated',
        'description' => 'Manteve uma avaliação média acima de 4.8 em 10 projetos.',
        'icon' => 'Trophy',
        'color' => 'text-yellow-500',
        'bg' => 'bg-yellow-100',
    ],
    [
        'slug' => 'entrega-relampago',
        'name' => 'Entrega Relâmpago',
        'description' => 'Entregou 5 projetos antes do prazo final.',
        'icon' => 'Zap',
        'color' => 'text-amber-500',
        'bg' => 'bg-amber-100',
    ],
    [
        'slug' => 'verificado',
        'name' => 'Verificado',
        'description' => 'Verificou identidade e documentos.',
        'icon' => 'Shield',
        'color' => 'text-green-500',
        'bg' => 'bg-green-100',
    ],
    [
        'slug' => 'veterano',
        'name' => 'Veterano',
        'description' => 'Ativo na plataforma por mais de 1 ano.',
        'icon' => 'Clock',
        'color' => 'text-purple-500',
        'bg' => 'bg-purple-100',
    ],
    [
        'slug' => 'mestre',
        'name' => 'Mestre',
        'description' => 'Completou 50 projetos com avaliação máxima.',
        'icon' => 'Award',
        'color' => 'text-red-500',
        'bg' => 'bg-red-100',
    ]
];

function get_profile_stats(PDO $pdo, int $freelancerId): array {
    $stmt = $pdo->prepare("SELECT projetos_concluidos, avaliacoes_avg FROM profiles_freelancer WHERE user_id = ? LIMIT 1");
    $stmt->execute([$freelancerId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $projects = (int)($row['projetos_concluidos'] ?? 0);
    $rating = (float)($row['avaliacoes_avg'] ?? 0);
    return ['projects' => $projects, 'rating' => $rating];
}

function tier_from_stats(int $projects, float $rating): string {
    if ($projects >= 50 && $rating >= 4.8) return 'top_plus';
    if ($projects >= 20 && $rating >= 4.7) return 'top';
    if ($projects >= 5) return 'talent';
    return 'none';
}

if ($method === 'GET') {
    try {
        // Fetch user unlocked medals
        $stmt = $pdo->prepare("SELECT medal_slug, progress, unlocked_at FROM user_medals WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $unlocked = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Map to key-value
        $user_medals_map = [];
        foreach ($unlocked as $m) {
            $user_medals_map[$m['medal_slug']] = $m;
        }

        // Merge with definitions
        $response = array_map(function($def) use ($user_medals_map) {
            $user_data = $user_medals_map[$def['slug']] ?? null;
            return [
                'id' => $def['slug'], // use slug as ID for frontend
                'name' => $def['name'],
                'description' => $def['description'],
                'icon_name' => $def['icon'], // Frontend will map string to Icon component
                'color' => $def['color'],
                'bg' => $def['bg'],
                'progress' => $user_data ? (int)$user_data['progress'] : 0,
                'unlocked' => !!$user_data,
                'unlocked_at' => $user_data['unlocked_at'] ?? null
            ];
        }, $all_medals);

        // Badge tier
        $b = $pdo->prepare("SELECT medalha_tipo, identidade_verificada_bool FROM badges WHERE freelancer_id = ? LIMIT 1");
        $b->execute([$user['id']]);
        $badge = $b->fetch(PDO::FETCH_ASSOC) ?: ['medalha_tipo' => 'none', 'identidade_verificada_bool' => 0];

        echo json_encode(['data' => $response, 'badge' => $badge]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    try {
        $targetId = isset($_POST['freelancer_id']) ? (int)$_POST['freelancer_id'] : (int)$user['id'];
        if ($targetId <= 0) $targetId = (int)$user['id'];
        $stats = get_profile_stats($pdo, $targetId);
        $tier = tier_from_stats($stats['projects'], $stats['rating']);
        $now = date('Y-m-d H:i:s');
        $nextCheck = date('Y-m-d', strtotime('+30 days'));
        $pdo->prepare("INSERT INTO badges (freelancer_id, medalha_tipo, concedida_em, proxima_verificacao) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE medalha_tipo = VALUES(medalha_tipo), concedida_em = VALUES(concedida_em), proxima_verificacao = VALUES(proxima_verificacao)")
            ->execute([$targetId, $tier, $now, $nextCheck]);
        $bonus = 0;
        if ($tier === 'talent') $bonus = 30;
        if ($tier === 'top') $bonus = 60;
        if ($tier === 'top_plus') $bonus = 120;
        $stmtW = $pdo->prepare("SELECT saldo_plano_mensal, saldo_medalha_bonus, saldo_nao_expiravel, renovacao_em FROM connections_wallet WHERE freelancer_id = ? LIMIT 1");
        $stmtW->execute([$targetId]);
        $w = $stmtW->fetch(PDO::FETCH_ASSOC);
        if ($w) {
            $pdo->prepare("UPDATE connections_wallet SET saldo_medalha_bonus = ? WHERE freelancer_id = ?")->execute([$bonus, $targetId]);
        } else {
            $pdo->prepare("INSERT INTO connections_wallet (freelancer_id, saldo_plano_mensal, saldo_medalha_bonus, saldo_nao_expiravel, renovacao_em) VALUES (?, 0, ?, 0, ?)")->execute([$targetId, $bonus, date('Y-m-01', strtotime('first day of next month'))]);
        }
        echo json_encode(['ok' => true, 'tier' => $tier, 'bonus' => $bonus, 'stats' => $stats]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

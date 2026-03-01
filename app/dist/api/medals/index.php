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

        echo json_encode(['data' => $response]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

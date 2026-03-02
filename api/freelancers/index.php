<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$pdo = db_get_pdo();

// --- Parameters ---
$id = isset($_GET['id']) ? trim((string)$_GET['id']) : null;
$page = max(1, intval($_GET['page'] ?? 1));
$per = max(1, min(50, intval($_GET['per_page'] ?? 12)));
$offset = ($page - 1) * $per;
$keyword = trim((string)($_GET['q'] ?? ''));
$ratingMin = isset($_GET['rating_min']) ? floatval($_GET['rating_min']) : null;
$category = trim((string)($_GET['category'] ?? ''));
$sort = $_GET['sort'] ?? 'relevance';

// --- Get Single Freelancer ---
if ($id) {
    try {
        $stmt = $pdo->prepare("
            SELECT
                u.id, u.email, u.created_at,
                pf.titulo, pf.bio, pf.habilidades, pf.avaliacoes_avg,
                pf.projetos_concluidos, pf.recomendacao_pct,
                r.score as ranking_score, r.position as ranking_position,
                b.identidade_verificada_bool, u.is_premium, u.plan
            FROM users u
            LEFT JOIN profiles_freelancer pf ON pf.user_id = u.id
            LEFT JOIN ranking r ON r.user_id = u.id AND r.period = 'weekly'
            LEFT JOIN badges b ON b.freelancer_id = u.id
            WHERE u.id = ? AND u.role = 'freelancer'
            LIMIT 1
        ");
        $stmt->execute([$id]);
        $r = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($r) {
            $skills = [];
            if (!empty($r['habilidades'])) {
                $decoded = json_decode($r['habilidades'], true);
                if (is_array($decoded)) $skills = array_values(array_filter($decoded, fn($v) => is_string($v)));
            }
            $displayName = (string)($r['titulo'] ?? explode('@', $r['email'])[0]);
            
            $item = [
                'id' => (string)$r['id'],
                'name' => $displayName,
                'username' => explode('@', $r['email'])[0],
                'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($displayName) . '&background=003366&color=fff',
                'title' => (string)($r['titulo'] ?? 'Freelancer'),
                'bio' => (string)($r['bio'] ?? ''),
                'skills' => $skills,
                'rating' => floatval($r['avaliacoes_avg'] ?? 0),
                'totalReviews' => 0, // TODO: Count reviews
                'completedProjects' => intval($r['projetos_concluidos'] ?? 0),
                'recommendations' => intval($r['recomendacao_pct'] ?? 0),
                'memberSince' => $r['created_at'],
                'ranking' => intval($r['ranking_position'] ?? 0),
                'rankingScore' => intval($r['ranking_score'] ?? 0),
                'isPremium' => (bool)$r['is_premium'],
                'isPro' => ($r['plan'] === 'pro' || $r['plan'] === 'premium'),
                'isVerified' => intval($r['identidade_verificada_bool'] ?? 0) === 1,
                'city' => null,
                'state' => null,
                'country' => null,
                'isOnline' => null
            ];
            json_response(['ok' => true, 'item' => $item]);
            exit;
        }
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 500);
        exit;
    }
    json_response(['ok' => false, 'error' => 'Not found'], 404);
    exit;
}

// --- List Freelancers ---

$where = ["u.role = 'freelancer'"];
$params = [];

if ($keyword !== '') {
    $where[] = "(pf.titulo LIKE ? OR pf.bio LIKE ? OR u.email LIKE ? OR pf.habilidades LIKE ?)";
    $kw = '%' . $keyword . '%';
    $params[] = $kw; 
    $params[] = $kw; 
    $params[] = $kw;
    $params[] = $kw;
}

if ($category !== '' && $category !== 'Todas as áreas') {
    // Skills are JSON array. JSON_SEARCH or LIKE can work.
    // For simplicity, using LIKE
    $where[] = "pf.habilidades LIKE ?";
    $params[] = '%' . $category . '%';
}

if ($ratingMin !== null) {
    $where[] = "pf.avaliacoes_avg >= ?";
    $params[] = $ratingMin;
}

$sqlWhere = 'WHERE ' . implode(' AND ', $where);

// Sorting
$orderBy = "u.is_premium DESC, pf.avaliacoes_avg DESC"; // Default
if ($sort === 'rank_desc') {
    $orderBy = "COALESCE(r.score, 0) DESC";
} elseif ($sort === 'alpha_asc') {
    $orderBy = "COALESCE(pf.titulo, u.email) ASC";
} elseif ($sort === 'alpha_desc') {
    $orderBy = "COALESCE(pf.titulo, u.email) DESC";
} elseif ($sort === 'projects_desc') {
    $orderBy = "pf.projetos_concluidos DESC";
} elseif ($sort === 'projects_asc') {
    $orderBy = "pf.projetos_concluidos ASC";
} elseif ($sort === 'recs_desc') {
    $orderBy = "pf.recomendacao_pct DESC";
} elseif ($sort === 'recs_asc') {
    $orderBy = "pf.recomendacao_pct ASC";
}

$sql = "
    SELECT
        u.id, u.email, u.created_at,
        pf.titulo, pf.bio, pf.habilidades, pf.avaliacoes_avg,
        pf.projetos_concluidos, pf.recomendacao_pct,
        r.score as ranking_score, r.position as ranking_position,
        b.identidade_verificada_bool, u.is_premium, u.plan
    FROM users u
    LEFT JOIN profiles_freelancer pf ON pf.user_id = u.id
    LEFT JOIN ranking r ON r.user_id = u.id AND r.period = 'weekly'
    LEFT JOIN badges b ON b.freelancer_id = u.id
    $sqlWhere
    ORDER BY $orderBy
    LIMIT ? OFFSET ?
";

try {
    $stmt = $pdo->prepare($sql);
    // Bind params + limit/offset
    foreach ($params as $k => $v) {
        $stmt->bindValue($k + 1, $v);
    }
    $stmt->bindValue(count($params) + 1, $per, PDO::PARAM_INT);
    $stmt->bindValue(count($params) + 2, $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Count total
    $countSql = "
        SELECT COUNT(*) as total
        FROM users u
        LEFT JOIN profiles_freelancer pf ON pf.user_id = u.id
        $sqlWhere
    ";
    $stmtCount = $pdo->prepare($countSql);
    $stmtCount->execute($params);
    $total = $stmtCount->fetchColumn();

    $items = [];
    foreach ($rows as $r) {
        $skills = [];
        if (!empty($r['habilidades'])) {
            $decoded = json_decode($r['habilidades'], true);
            if (is_array($decoded)) $skills = array_values(array_filter($decoded, fn($v) => is_string($v)));
        }
        $displayName = (string)($r['titulo'] ?? explode('@', $r['email'])[0]);
        
        $items[] = [
            'id' => (string)$r['id'],
            'name' => $displayName,
            'username' => explode('@', $r['email'])[0],
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($displayName) . '&background=003366&color=fff',
            'title' => (string)($r['titulo'] ?? 'Freelancer'),
            'bio' => (string)($r['bio'] ?? ''),
            'skills' => $skills,
            'rating' => floatval($r['avaliacoes_avg'] ?? 0),
            'totalReviews' => 0,
            'completedProjects' => intval($r['projetos_concluidos'] ?? 0),
            'recommendations' => intval($r['recomendacao_pct'] ?? 0),
            'memberSince' => $r['created_at'],
            'ranking' => intval($r['ranking_position'] ?? 0),
            'rankingScore' => intval($r['ranking_score'] ?? 0),
            'isPremium' => (bool)$r['is_premium'],
            'isPro' => ($r['plan'] === 'pro' || $r['plan'] === 'premium'),
            'isVerified' => intval($r['identidade_verificada_bool'] ?? 0) === 1,
            'city' => null,
            'state' => null,
            'country' => null,
            'isOnline' => null // Todo: Check last activity
        ];
    }

    json_response([
        'ok' => true,
        'items' => $items,
        'total' => (int)$total,
        'page' => $page,
        'per_page' => $per
    ]);

} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Erro interno: ' . $e->getMessage()], 500);
}

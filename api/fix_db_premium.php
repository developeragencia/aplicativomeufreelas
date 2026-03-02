<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

try {
    $pdo = db_get_pdo();
    
    // Add is_premium column if not exists
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN is_premium TINYINT(1) DEFAULT 0");
        echo "Column is_premium added.\n";
    } catch (PDOException $e) {
        echo "Column is_premium likely exists or error: " . $e->getMessage() . "\n";
    }

    // Add plan column if not exists
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN plan VARCHAR(50) DEFAULT 'free'");
        echo "Column plan added.\n";
    } catch (PDOException $e) {
        echo "Column plan likely exists or error: " . $e->getMessage() . "\n";
    }

    // Add plan_expires_at column if not exists
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN plan_expires_at DATETIME NULL");
        echo "Column plan_expires_at added.\n";
    } catch (PDOException $e) {
        echo "Column plan_expires_at likely exists or error: " . $e->getMessage() . "\n";
    }

    echo "Database updated successfully.";

} catch (Throwable $e) {
    echo "Error: " . $e->getMessage();
}

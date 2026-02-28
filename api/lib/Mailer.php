<?php
namespace App;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../_env.php';

class Mailer {
  private static function getConfig(): array {
    return [
      'host' => env('SMTP_HOST', 'smtp.hostinger.com'),
      'port' => (int)(env('SMTP_PORT', '465') ?: 465),
      'secure' => env('SMTP_SECURE', 'true') === 'true' ? 'ssl' : 'tls',
      'user' => env('SMTP_USER', ''),
      'pass' => env('SMTP_PASS', ''),
      'from' => env('SMTP_FROM', env('SMTP_USER', '')),
      'from_name' => env('SMTP_FROM_NAME', 'MeuFreelas'),
    ];
  }

  public static function send(string $toEmail, string $toName, string $subject, string $html, ?string $text = null): bool {
    $cfg = self::getConfig();
    try {
      $mail = new PHPMailer(true);
      $mail->isSMTP();
      $mail->Host = $cfg['host'];
      $mail->Port = $cfg['port'];
      $mail->SMTPSecure = $cfg['secure'];
      $mail->SMTPAuth = true;
      $mail->Username = $cfg['user'];
      $mail->Password = $cfg['pass'];
      $mail->CharSet = 'UTF-8';
      $mail->setFrom($cfg['from'], $cfg['from_name']);
      $mail->addAddress($toEmail, $toName);
      $mail->Subject = $subject;
      $mail->isHTML(true);
      $mail->Body = $html;
      $mail->AltBody = $text ?: strip_tags($html);
      return $mail->send();
    } catch (\Throwable $e) {
      if (function_exists('error_log')) {
        error_log('[mailer] ' . $e->getMessage());
      }
      return false;
    }
  }
}

<?php
require_once __DIR__ . '/_env.php';
class Mailer {
  public static function send(string $to, string $name, string $subject, string $html): bool {
    $fromEmail = env('SMTP_FROM', env('MAIL_FROM_EMAIL', 'no-reply@meufreelas.com.br'));
    $fromName = env('SMTP_FROM_NAME', env('MAIL_FROM_NAME', 'MeuFreelas'));
    $host = env('SMTP_HOST', '');
    $port = (int)env('SMTP_PORT', '0');
    $secure = strtolower(trim(env('SMTP_SECURE', '')));
    $user = env('SMTP_USER', '');
    $pass = env('SMTP_PASS', '');

    if (file_exists(__DIR__ . '/vendor/autoload.php')) {
      require_once __DIR__ . '/vendor/autoload.php';
      if (class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
        try {
          $mail = new PHPMailer\PHPMailer\PHPMailer(true);
          $mail->CharSet = 'UTF-8';
          if ($host) {
            $mail->isSMTP();
            $mail->Host = $host;
            if ($port > 0) $mail->Port = $port;
            $mode = $secure;
            if ($mode === 'true' || $mode === '1') $mode = ($port === 465 ? 'ssl' : 'tls');
            if ($mode === 'ssl' || $mode === 'tls') $mail->SMTPSecure = $mode;
            $mail->SMTPAuth = !!$user || !!$pass;
            if ($user) $mail->Username = $user;
            if ($pass) $mail->Password = $pass;
          }
          $mail->setFrom($fromEmail, $fromName);
          $mail->addAddress($to, $name);
          $mail->isHTML(true);
          $mail->Subject = $subject;
          $mail->Body = $html;
          return $mail->send();
        } catch (\Throwable $e) {
          // Fallback para mail()
        }
      }
    }
    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = 'From: ' . self::encodeHeader($fromName) . " <{$fromEmail}>";
    $headers[] = 'Reply-To: ' . $fromEmail;
    $headers[] = 'X-Mailer: PHP/' . phpversion();
    $encodedSubject = self::encodeHeader($subject);
    return @mail($to, $encodedSubject, $html, implode("\r\n", $headers));
  }
  private static function encodeHeader(string $text): string {
    return '=?UTF-8?B?' . base64_encode($text) . '?=';
  }
}

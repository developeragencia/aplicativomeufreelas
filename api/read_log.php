<?php
if (file_exists('debug_messages.log')) {
    echo nl2br(file_get_contents('debug_messages.log'));
} else {
    echo "No log found.";
}

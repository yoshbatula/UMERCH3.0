<?php

return [
    'site_key' => env('RECAPTCHA_SITE_KEY'),
    'secret_key' => env('RECAPTCHA_SECRET_KEY'),
    'threshold' => 0.5, // reCAPTCHA v3 score threshold (0.0 to 1.0, higher = more strict)
];

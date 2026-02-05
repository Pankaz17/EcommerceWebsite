<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

require __DIR__ . '/../vendor/autoload.php';

// Bootstrap the Laravel application and handle the HTTP request.
(require __DIR__ . '/../bootstrap/app.php')
    ->handleRequest(Request::capture());


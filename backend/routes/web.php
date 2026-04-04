<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return response()->json([
        'message' => 'Shoe Site API',
        'version' => '1.0.0',
    ]);
});

/*
 * Serve uploaded public-disk files when `public/storage` symlink is missing or broken
 * (common on Windows without Developer Mode). PHP's built-in server then still resolves
 * GET /storage/products/... from storage/app/public/products/...
 */
Route::get('/storage/{path}', function (string $path) {
    if (str_contains($path, '..')) {
        abort(404);
    }
    if (! preg_match('#^products/[a-zA-Z0-9._\-]+$#', $path)) {
        abort(404);
    }
    if (! Storage::disk('public')->exists($path)) {
        abort(404);
    }

    return Storage::disk('public')->response($path);
})->where('path', '.*');


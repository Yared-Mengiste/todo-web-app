<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\TodoController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('todos', TodoController::class);}
);



require __DIR__.'/auth.php';

<?php

use Illuminate\Http\Request;
use App\User;
use Tymon\JWTAuth\Facades\JWTAuth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
*/

Route::auth();

Route::group([
    'prefix' => 'post'
], function() {
    Route::get('', 'PostApiController@list');
    Route::get('{type}/{id}', 'PostApiController@list');
    Route::get('{userId}/{type}/{id}', 'PostApiController@listByUser');
    Route::get('{userId}', 'PostApiController@wall');
});

Route::group([
    'prefix' => 'auth'
], function() {
    Route::post('login', 'AuthApiController@login');
    Route::post('register', 'AuthApiController@register');
    Route::get('search/{keyword?}', 'AuthApiController@search');
});

Route::group([ 'middleware' => 'jwt.auth' ], function() {

	Route::group([
		'prefix' => 'post'
	], function() {
		Route::put('', 'PostApiController@write');
		Route::put('{id}', 'PostApiController@edit');
		Route::delete('{id}', 'PostApiController@delete');
		Route::post('smile/{id}', 'PostApiController@smile');
	});

	Route::group([
		'prefix' => 'auth'
	], function() {
		Route::get('info', 'AuthApiController@info');
		Route::post('logout', 'AuthApiController@logout')->middleware('jwt.refresh');
	}); 

});

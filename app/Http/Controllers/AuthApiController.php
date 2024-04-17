<?php
namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthApiController extends Controller
{
    const ERROR_CODE_AUTH     = 1;
    const ERROR_CODE_VALIDATE = 2;
    const ERROR_CODE_FAIL     = 3;

    /**
     * ログイン処理.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        try {
            if ( ! $token = JWTAuth::attempt($credentials)) {
                return \Response::json([
                    'message' => 'ログイン失敗',
                    'code'    => self::ERROR_CODE_AUTH,
                ], 401);
            }
        } catch (JWTException $e) {
            return \Response::json([
                'message' => 'ログイン失敗',
                'code'    => self::ERROR_CODE_AUTH,
            ], 500);
        }

        try {
            Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']]);
        } catch (\Exception $e) {
            return \Response::json([
                'message' => 'ログイン失敗',
                'code'    => self::ERROR_CODE_AUTH,
            ], 401);
        }

        $user = User::where('email', $credentials['email'])->first();

        return \Response::json([
            'status' => true,
            'token'  => $token,
            'id'     => $user->id,
            'name'   => $user->name,
            'class'  => \Response::class,
        ], 200);
    }

    /**
     * ユーザー登録処理.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $credentials = $request->only('email', 'name', 'password');

        $validator = \Validator::make($credentials, [
            'email'    => 'required|email|unique:users',
            'name'     => 'required',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return \Response::json([
                'message' => 'ユーザー登録失敗',
                'code'    => self::ERROR_CODE_VALIDATE,
            ], 400);
        }

        $user = static::create($credentials);

        $token = JWTAuth::fromUser($user);

        return \Response::json([
            'status' => true,
            'token'  => $token,
        ], 200);
    }

    /**
     * ログアウト処理.
     *
     * @param Request $request
     *
     * @return void
     */
    public function logout(Request $request)
    {
        // noop
    }

    /**
     * ユーザー検索.
     *
     * @param string $keyword
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function search($keyword = '')
    {
        if (empty($keyword)) {
            return \Response::json([], 200);
        }
        $users = User::where('name', 'like', "{$keyword}%")->select('id', 'name')->get();

        return \Response::json($users, 200);
    }

    /**
     * ログイン判定、ユーザー情報.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function info(Request $request)
    {
        try {
            $authenticate = JWTAuth::parseToken()->authenticate();
        } catch (\Exception $e) {
            return \Response::json([
                'message' => 'ユーザー情報取得失敗',
                'code'    => self::ERROR_CODE_AUTH,
            ], 401);
        }

        return \Response::json($authenticate, 200);
    }

    /**
     * ユーザー登録（パスワードをbcryptするため）.
     *
     * @param array $data
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected static function create(array $data)
    {
        return User::create([
            'email'    => $data['email'],
            'name'     => $data['name'],
            'password' => bcrypt($data['password']),
        ]);
    }
}

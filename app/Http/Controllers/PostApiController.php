<?php
namespace App\Http\Controllers;

use App\Post;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostApiController extends Controller
{
    const ERROR_CODE_AUTH     = 1;
    const ERROR_CODE_VALIDATE = 2;
    const ERROR_CODE_FAIL     = 3;

    /**
     * ポストリスト取得.
     *
     * @param string|null $type
     * @param int|null $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function list($type = null, $id = null)
    {
        $results = static::getList($type, $id);

        return \Response::json($results, 200);
    }

     /**
     * ユーザーポストリスト取得.
     *
     * @param int|null $userId
     * @param string|null $type
     * @param int|null $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function listByUser($userId = null, $type = null, $id = null)
    {
        $results = static::getList($type, $id, $userId);

        return \Response::json($results, 200);
    }

    /**
     * ポスト編集.
     *
     * @param int $id
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit($id, Request $request)
    {
        if (Auth::guest()) {
            return \Response::json([
                'message' => 'ログインしていない',
                'code'    => self::ERROR_CODE_AUTH,
            ], 403);
        }

        $contents = $request->input('contents');

        $validator = \Validator::make([
            'id'       => $id,
            'contents' => $contents,
        ], [
            'id'       => 'required|integer',
            'contents' => 'required|string',
        ]);

        if ($validator->fails()) {
            return \Response::json([
                'message' => '編集失敗',
                'code'    => self::ERROR_CODE_VALIDATE,
            ], 400);
        }

        Post::find($id)->update([
            'contents'  => $contents,
            'is_edited' => 1,
        ]);

        $post = $this->getItem($id);

        return \Response::json([
            'success' => true,
            'post'    => $post,
        ], 200);
    }

    /**
     * いいね.
     *
     * @param int $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function smile($id)
    {
        if (Auth::guest()) {
            return \Response::json([
                'message' => 'ログインしていない',
                'code'    => self::ERROR_CODE_AUTH,
            ], 403);
        }
        $userId = Auth::id();

        $post = $this->getItem($id);

        $validator = \Validator::make([
            'id' => $id,
        ], [
            'id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return \Response::json([
                'message' => 'いいね失敗',
                'code'    => self::ERROR_CODE_VALIDATE,
            ], 400);
        }

        $smiled    = $post->smiled;
        $hasSmiled = false;
        if (in_array($userId, $smiled, true)) {
            $index = array_search($userId, $smiled, true);
            unset($smiled[$index]);
            $hasSmiled = true;
        } else {
            $smiled[] = $userId;
        }
        $post->smiled = $smiled;

        Post::find($id)->update([
            'smiled' => serialize($smiled),
        ]);

        return \Response::json([
            'success'    => true,
            'has_smiled' => ! $hasSmiled,
            'post'       => $post,
        ], 200);
    }

    /**
     * 削除.
     *
     * @param int $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete($id)
    {
        if (Auth::guest()) {
            return \Response::json([
                'message' => 'ログインしていない',
                'code'    => self::ERROR_CODE_AUTH,
            ], 403);
        }
        $validator = \Validator::make([
            'id' => $id,
        ], [
            'id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return \Response::json([
                'message' => '削除失敗',
                'code'    => self::ERROR_CODE_VALIDATE,
            ], 400);
        }
        Post::find($id)->delete();

        return \Response::json([
            'success' => true,
        ], 200);
    }

    /**
     * ユーザーウォール.
     *
     * @param int|null $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function wall($userId = null)
    {
        $validator = \Validator::make([
            'userId' => $userId,
        ], [
            'userId' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return \Response::json([
                'message' => '取得失敗',
                'code'    => self::ERROR_CODE_VALIDATE,
            ], 400);
        }
        $results = static::getList(null, null, $userId);

        return \Response::json($results, 200);
    }

    /**
     * ポスト登録.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function write(Request $request)
    {
        if (Auth::guest()) {
            return \Response::json([
                'message' => 'ログインしていない',
                'code'    => self::ERROR_CODE_AUTH,
            ], 403);
        }
        $id = Auth::id();

        $contents = $request->input('contents');

        $validator = \Validator::make([
            'contents' => $contents,
        ], [
            'contents' => 'required|string',
        ]);

        if ($validator->fails()) {
            return \Response::json([
                'message' => '登録失敗',
                'code'    => self::ERROR_CODE_VALIDATE,
            ], 400);
        }

        Post::create([
            'writer'   => $id,
            'contents' => $request->input('contents'),
            'smiled'   => serialize([]),
        ]);

        return \Response::json([
            'success' => true,
        ], 200);
    }

    /**
     * ポスト取得（一ポスト）.
     *
     * @param Request $request
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    private static function getItem($id)
    {
        $postTable = Post::getTableName();
        $userTable = User::getTableName();

        $columnUserId     = static::makeSelectColumn('id', $userTable);
        $columnUserName   = static::makeSelectColumn('name', $userTable);
        $columnPostId     = static::makeSelectColumn('id', $postTable);
        $columnPostAll    = static::makeSelectColumn('*', $postTable);
        $columnPostWriter = static::makeSelectColumn('writer', $postTable);

        $post = Post::leftJoin($userTable, $columnPostWriter, '=', $columnUserId)
                    ->select($columnPostAll, $columnUserName)
                    ->where($columnPostId, $id)
                    ->first();
        $post->is_edited = $post->is_edited === 1 ? true : false;
        $post->smiled    = unserialize($post->smiled);

        return $post;
    }

    /**
     * ポスト取得（複数）.
     *
     * @param Request $request
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    private static function getList($type, $id, $userId = null)
    {
        $postTable = Post::getTableName();
        $userTable = User::getTableName();

        $columnUserId     = static::makeSelectColumn('id', $userTable);
        $columnUserName   = static::makeSelectColumn('name', $userTable);
        $columnPostId     = static::makeSelectColumn('id', $postTable);
        $columnPostAll    = static::makeSelectColumn('*', $postTable);
        $columnPostWriter = static::makeSelectColumn('writer', $postTable);

        $posts = Post::leftJoin($userTable, $columnPostWriter, '=', $columnUserId)
                    ->select($columnPostAll, $columnUserName);

        if ($type === 'new') {
            $posts->where($columnPostId, '>', $id);
        } elseif ($type === 'old') {
            $posts->where($columnPostId, '<', $id);
        }
        if ($userId !== null) {
            $posts->where($columnPostWriter, $userId);
        }
        $posts->take(10)->orderBy($columnUserId, 'DESC');
        $results = $posts->get();

        foreach ($results as $result) {
            $result->is_edited = $result->is_edited === 1 ? true : false;
            $result->smiled    = unserialize($result->smiled);
        }

        return $results;
    }

    /**
     * ポスト取得（複数）.
     *
     * @param string $column
     * @param string|null $table
     *
     * @return string
     */
    private static function makeSelectColumn($column, $table = null)
    {
        return (is_string($table) ? $table . '.' : '') . $column;
    }
}

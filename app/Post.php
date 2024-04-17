<?php
namespace App;

use App\Traits\EloquentGetTableName;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use EloquentGetTableName;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $table = 'posts';

    protected $fillable = [
        'id', 'writer', 'contents', 'is_edited', 'smiled',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [

    ];
}

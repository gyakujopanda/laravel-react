<?php
namespace App\Traits;

trait EloquentGetTableName
{
    /**
     * テーブル名取得.
     *
     * @return string
     */
    public static function getTableName()
    {
        return (new self())->getTable();
    }
}

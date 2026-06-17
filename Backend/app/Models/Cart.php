<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = ['user_id'];

    public function details()
    {
        return $this->hasMany(CartDetail::class);
    }
}

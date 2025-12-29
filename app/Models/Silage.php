<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Silage extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'amount',
        'type',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function scopeMade($query)
    {
        return $query->where('type', 'made');
    }

    public function scopeUsed($query)
    {
        return $query->where('type', 'used');
    }
}

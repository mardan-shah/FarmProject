<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MilkProduction extends Model
{
    protected $fillable = [
        'user_id',
        'production_date',
        'milk_kg',
        'notes',
    ];

    protected $casts = [
        'production_date' => 'date',
        'milk_kg' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

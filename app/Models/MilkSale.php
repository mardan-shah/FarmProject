<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MilkSale extends Model
{
    protected $fillable = [
        'user_id',
        'sale_date',
        'milk_kg',
        'sale_amount',
        'notes',
    ];

    protected $casts = [
        'sale_date' => 'date',
        'milk_kg' => 'decimal:2',
        'sale_amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cow extends Model
{
    use HasFactory;

    protected $fillable = [
        'cow_number',
        'name',
        'notes',
        'type',
        'status',
        'is_pregnant',
        'pregnancy_date',
        'pregnancy_method',
    ];

    protected $casts = [
        'is_pregnant' => 'boolean',
        'pregnancy_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Map 'number' to 'cow_number' for frontend compatibility
    public function setNumberAttribute($value)
    {
        $this->attributes['cow_number'] = $value;
    }

    public function getNumberAttribute()
    {
        return $this->attributes['cow_number'] ?? null;
    }

    // Append 'number' to appends for JSON serialization
    protected $appends = ['number'];

    public function scopeMilkProducing($query)
    {
        return $query->where('type', 'milk-producing');
    }

    public function scopeNonMilkProducing($query)
    {
        return $query->where('type', 'non-milk-producing');
    }

    public function scopeChilds($query)
    {
        return $query->where('type', 'child');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }
}

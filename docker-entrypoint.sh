#!/bin/bash
set -e

# Run migrations if DB credentials are present
if [ -n "$DB_HOST" ]; then
    echo "Running migrations..."
    php artisan migrate --force || echo "Migration failed, continuing..."
fi

# Clear and cache configurations
echo "Clearing caches..."
php artisan optimize:clear || echo "Cache clear failed, continuing..."

echo "Caching configuration..."
php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache

# Fix permissions for storage directory
echo "Fixing permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

echo "Starting Apache..."
exec "$@"
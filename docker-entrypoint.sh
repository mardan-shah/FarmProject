#!/bin/bash
set -e

# Turn on maintenance mode
# php artisan down || true

# Run migrations if DB credentials are present
if [ -n "$DB_DATABASE" ]; then
    echo "Running migrations..."
    php artisan migrate --force || echo "Migration failed, continuing..."
fi

# Clear any old caches and re-optimize
php artisan config:clear
php artisan route:clear
php artisan view:clear

if [ -n "$APP_KEY" ]; then
    echo "Caching configuration..."
    php artisan optimize
    php artisan view:cache
fi

# Fix permissions for storage directory just in case
chown -R www-data:www-data /var/www/html/storage

# Turn off maintenance mode
# php artisan up

echo "Starting Apache..."
exec "$@"

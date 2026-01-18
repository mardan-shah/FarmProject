#!/bin/bash
set -e
set -x  # <--- CRITICAL: Prints every command to the logs so you see where it crashes

echo "🚀 Container startup initiated..."

# fix permissions (do this early)
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Run migrations (Non-blocking)
if [ -n "$DB_HOST" ]; then
    echo "🔍 Database host detected: $DB_HOST"
    # We use a try/catch block approach
    if php artisan migrate --force; then
        echo "✅ Migrations successful."
    else
        echo "⚠️ Migrations failed! Check DB credentials. App will start anyway."
    fi
fi

# Cache Configs (Protected)
# We allow these to fail so the container doesn't die. 
# You can fix the config errors later by looking at logs.
echo "📂 Caching configuration..."
php artisan optimize:clear || echo "⚠️ Failed to clear cache"
php artisan config:cache || echo "⚠️ Failed to cache config"
php artisan route:cache || echo "⚠️ Failed to cache routes"
php artisan view:cache || echo "⚠️ Failed to cache views"

echo "🏁 Starting Apache..."
# exec is crucial - it replaces the shell with the apache process
exec "$@"
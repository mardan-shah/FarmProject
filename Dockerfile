# Stage 1: Build the frontend assets
FROM node:20-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --quiet
COPY . .
RUN npm run build

# Stage 2: Serve the application with PHP & Apache
FROM php:8.4-apache

# Install system dependencies (including dos2unix)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    dos2unix \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip opcache

# Enable Apache rewrite module
RUN a2enmod rewrite

# Configure Apache
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# 1. Update the document root
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf \
    && echo "ServerName localhost" >> /etc/apache2/apache2.conf

# 2. CRITICAL FIX: Allow .htaccess overrides (Fixes 404 on login)
RUN echo "<Directory ${APACHE_DOCUMENT_ROOT}>" > /etc/apache2/conf-available/laravel.conf \
    && echo "    Options Indexes FollowSymLinks" >> /etc/apache2/conf-available/laravel.conf \
    && echo "    AllowOverride All" >> /etc/apache2/conf-available/laravel.conf \
    && echo "    Require all granted" >> /etc/apache2/conf-available/laravel.conf \
    && echo "</Directory>" >> /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first for caching
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy the rest of the app
COPY . .

# Copy built assets
COPY --from=frontend /app/public/build public/build

# Setup entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN dos2unix /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Optimized Permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80

# The critical startup command
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
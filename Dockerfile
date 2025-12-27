# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Build Backend Dependencies
FROM composer:2 AS backend

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --ignore-platform-reqs --no-interaction --prefer-dist --no-scripts

# Stage 3: Production Image
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    freetype-dev \
    libjpeg-turbo-dev \
    libzip-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql bcmath zip opcache

# Configure PHP-FPM
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisor/supervisord.conf /etc/supervisord.conf

# Setup working directory
WORKDIR /var/www/html

# Copy backend dependencies
COPY --from=backend /app/vendor/ /var/www/html/vendor/

# Copy frontend assets
COPY --from=frontend /app/public/build/ /var/www/html/public/build/

# Copy application code
COPY . .

# Remove stale cache files
RUN rm -rf bootstrap/cache/*.php

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Expose port 80
EXPOSE 80

# Start Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

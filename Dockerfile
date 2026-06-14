FROM node:20 AS node

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM php:8.2-apache

RUN a2enmod rewrite

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev \
    libzip-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .
COPY --from=node /app/public/build ./public/build
RUN composer install --no-dev --optimize-autoloader \
    && php artisan storage:link \
    && cp .env.example .env \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

COPY apache.conf /etc/apache2/sites-available/000-default.conf

CMD php artisan migrate --force && apache2-foreground

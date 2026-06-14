FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev \
    libzip-dev \
    libxml2-dev \
    libonig-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip gd mbstring xml

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN cp .env.example .env && composer install --no-dev --optimize-autoloader && php artisan storage:link

CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT

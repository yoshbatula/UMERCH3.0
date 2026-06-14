#!/usr/bin/env bash

php artisan optimize:clear
php artisan optimize
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan serve --host=0.0.0.0 --port=$PORT

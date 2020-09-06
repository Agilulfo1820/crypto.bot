# Set environment variables for dev
export NODE_ENV=${APP_ENV:-development}
export PORT=${PORT:-8080}
export APP_NAME=${APP_NAME:-crypto.bot}
export SERVICE_PREFIX=${SERVICE_PREFIX:-crypto.bot}

export DB_PORT=${DB_PORT:-3307}
export DB_ROOT_PASSWORD=${DB_ROOT_PASSWORD:-password}
export DB_DATABASE=${DB_DATABASE:-homestead}
export DB_USER=${DB_USER:-homestead}
export DB_PASSWORD=${DB_PASSWORD:-secret}

# Decide which compose command & docker-compose file to use
COMPOSE="docker-compose -f ./deploy/docker-compose.yml"

if [ $# -gt 0 ];then
  # If "build" is used, run the build command
    if [ "$1 $2" == "build db" ]; then
      shift 1
	    docker build -f ./deploy/mysql/Dockerfile .
    elif [ "$1" == "build" ]; then
        shift 1
        docker build -f ./deploy/api/Dockerfile .
    elif [ "$1" == "bash" ]; then
        shift 1
        docker exec -it crypto.bot-api /bin/sh
    elif [ "$1" == "mfs" ]; then
        shift 1
        $COMPOSE run --rm \
            -w /srv/app \
            --entrypoint "adonis migration:refresh --seed" \
            api \
            "$@"
    elif [ "$1" == "test" ]; then
        shift 1
        $COMPOSE run --rm \
            -w /srv/app \
            --entrypoint "adonis test" \
            api \
            "$@"
    elif [ "$1" == "adonis" ]; then
        shift 1
        $COMPOSE run --rm \
            -w /srv/app \
            --entrypoint "adonis" \
            api \
            "$@"
    else
        $COMPOSE "$@"
    fi
else
    $COMPOSE ps
fi

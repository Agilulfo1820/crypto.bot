## Overview

This project is built on top of [Adonis.js](https://github.com/adonisjs/core) framework. Docker is used to create an image of the app, run all the services and start the app in a more developer friendly way. I recommend using ```develop.sh``` commands for your daily development since it makes it easy to run the app. 


The purpose of this app is to automatically trade cryptocurrencies based on a specific strategy that you set.
## Requirements

This project uses Docker so, in order to run it, you will only need:
- Docker
- Docker-compose

#### Docker Windows troubleshooting
Install [docker for windows](https://docs.docker.com/docker-for-windows/install/)

Turn on Hyper-Visor:

Run powershell as administrator and enter this into the console (will need to reboot after)

```Enable-WindowsOptionalFeature -Online -FeatureName:Microsoft-Hyper-V -All```

Inside windows docker settings, select **Expose daemon on tcp://localhost:2375 without TLS**

## Setup

1. Git clone this project
2. Enter the project directory
3. Create a .env file
4. Run `./develop.sh up` to build the images and start the containers 
(you can use the `-d` flag to run containers in the background)
5. Run `./develop.sh bash` to enter the api container. Now you can execute adonis commands.
6. Run `./develop.sh adonis key:generate` in the bash to generate an App Key
7. Run `./develop.sh mfs` to run the migrations

Now you should be setup and able to use the app. 
Usually 127.0.0.1:8080 is the host for the api and 127.17.0.1:3307 is the host for mysql.

For testing you will need to manually create a db named ```test```.

## Commands to use with Docker
develop.sh is the shell script that can be used to execute commands using docker, usage from within the app drive is as follows:

**CMD:** ```./develop.sh up```

This spins up the API and MySQL docker containers. The ```-d``` tag may be added onto the end to daemonize this process.

**CMD:** ```./develop.sh down```

This command kills the API and MySQL containers.

**CMD:** ```./develop.sh bash```

This command starts a new bash shell inside of a running API container.

**CMD:** ```./develop.sh build```

This command will build the api container.

**CMD:** ```./develop.sh build db```

This command will build the mysql container.

**CMD:** ```./develop.sh mfs```

This command will rollback the database, migrate everything again and seed it.

**CMD:** ```docker exec -it crypto.bot-mysql /bin/bash``` then ```mysql -p```

Connect to dockerized mysql in the terminal.

**CMD:** ```./develop.sh test```

This command will run the tests.

**CMD:** ```./develop.sh adonis```

Run adonis commands, eg: ./develop.sh adonis key:generate

## Docker Basics

**CMD:** ```docker ps```

View the running containers.

Example output:
```
CONTAINER ID        IMAGE                COMMAND                  CREATED             STATUS              PORTS                    NAMES
26d32c19d8f4        deploy_mysql         "docker-entrypoint..."   48 seconds ago      Up 47 seconds       0.0.0.0:3306->3306/tcp   deploy_mysql_1
b49f65f1df72        develop/podium/api   "/usr/bin/supervisor..."   48 seconds ago      Up 48 seconds       0.0.0.0:80->80/tcp       deploy_api_1
```

**CMD:** ```docker kill [CONTAINER ID] ```

Kill the docker container with the specified ID.

**CMD:** ```docker stop [CONTAINER ID] ```

Stop the docker container with the specified ID.

**CMD:** ```docker rm [CONTAINER ID] ```

Remove the docker container with the specified ID.

**CMD:** ```docker image prune -a ```

This command will delete all builded images a part of the ones that are currently running.

**CMD:** ```docker volume prune ```

Remove all volumes.

## Common Issues

-_SQL is unable to mount & persist database_

Temporary solution is to comment out this line in the docker-compose.dev.yml
```
volumes:
     - mysqldata:/var/lib/mysql
```
**This will mean that the database will be wiped when the MySQL docker container is stopped.**

-_Database file system does not mount any of the files from the local system_

Bring down the docker image

Inside Docker settings > Shared Drives

Uncheck the C drive and hit apply

Recheck the C drive and hit apply again `./develop.sh up`

**To ensure this will work you can clear the cache by doing** ```docker system prune``` 

## Documentation

This project is using Swagger.

Open http://localhost/docs in your browser to read the documentation.

[Link](https://github.com/ahmadarif/adonis-swagger) to Swagger documentation.
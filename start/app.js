'use strict'

const path = require('path');

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
    '@adonisjs/framework/providers/AppProvider',
    '@adonisjs/framework/providers/ViewProvider',
    '@adonisjs/lucid/providers/LucidProvider',
    '@adonisjs/bodyparser/providers/BodyParserProvider',
    '@adonisjs/cors/providers/CorsProvider',
    '@adonisjs/shield/providers/ShieldProvider',
    '@adonisjs/session/providers/SessionProvider',
    '@adonisjs/auth/providers/AuthProvider',
    '@adonisjs/validator/providers/ValidatorProvider',
    'adonis-bumblebee/providers/BumblebeeProvider',
    'adonis-acl/providers/AclProvider',
    'adonis-swagger/providers/SwaggerProvider',
    path.join(__dirname, '..', 'providers', 'Validators/ExistsValidator'),
    'adonis-scheduler/providers/SchedulerProvider',
    path.join(__dirname, '..', 'providers', 'RouteBinding/RouteModelBindingProvider'),
    'adonis-jsonable/providers/JsonableProvider',
    path.join(__dirname, '..', 'providers', 'Validators/DateFormatValidator'),
    '@adonisjs/drive/providers/DriveProvider',
    'adonis-lucid-polymorphic/providers/PolymorphicProvider',
    '@radmen/adonis-lucid-soft-deletes/providers/SoftDeletesProvider',
    path.join(__dirname, '..', 'providers', 'Validators/NotExistsValidator'),
    '@adonisjs/cors/providers/CorsProvider',
    'adonis-kue/providers/KueProvider',
    '@adonisjs/redis/providers/RedisProvider'
]

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = [
    '@adonisjs/lucid/providers/MigrationsProvider',
    'adonis-bumblebee/providers/CommandsProvider',
    'adonis-acl/providers/CommandsProvider',
    '@adonisjs/vow/providers/VowProvider',
    'adonis-scheduler/providers/CommandsProvider',
    'adonis-kue-provider/providers/CommandsProvider',
]

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
const aliases = {
    Role: 'Adonis/Acl/Role',
    Permission: 'Adonis/Acl/Permission',
    Scheduler: 'Adonis/Addons/Scheduler',
    Kue: 'Adonis/Addons/Kue'
}

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = [
    'Adonis/Commands/Kue:Listen'
]

/*
|--------------------------------------------------------------------------
| Jobs
|--------------------------------------------------------------------------
|
| Here you store your jobs
|
*/
const jobs = [
    'App/Jobs/TDSequantialStrategyJob'
]

module.exports = {providers, aceProviders, aliases, commands, jobs}

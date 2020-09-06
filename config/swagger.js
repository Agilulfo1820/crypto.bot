'use strict'

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Swagger Information
  | Please use Swagger 2 Spesification Docs
  | https://swagger.io/docs/specification/2-0/basic-structure/
  |--------------------------------------------------------------------------
  */

  enable: true,
  specUrl: '/swagger.json',

  options: {
    swaggerDefinition: {
      info: {
        title: 'Crypto Bot API Swagger',
        version: '1.0.0',
      },
  
      basePath: '/',
    },

    // Path to the API docs
    // Sample usage
    // apis: [
    //    'docs/**/*.yml',    // load recursive all .yml file in docs directory
    //    'docs/**/*.js',     // load recursive all .js file in docs directory
    // ]
    apis: [
      'app/**/*.js',
      'start/routes.js'
    ]
  }
}
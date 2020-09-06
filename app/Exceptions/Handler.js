'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response, session }) {
    if (error.name === 'ValidationException') {
      return response.status(422).json({
        code: error.message,
        message: error.messages
      })
    }

    if (error.name === 'ForbiddenException') {
      return response.status(403).json({
        code: 'HTTP_FORBIDDEN',
        message: 'Access forbidden. You are not allowed to this resource.'
      })
    }

    if (error.code === 'E_INVALID_SESSION') {
      return response.status(403).json({
        code: error.code,
        message: 'You must be authenticated to access this page!'
      })
    }

    if (error.code === 'E_JWT_TOKEN_EXPIRED') {
      return response.status(401).json({
        code: error.code,
        message: 'The jwt token has been expired. Generate a new one to continue'
      })
    }

    if (error.code === 'E_INVALID_JWT_TOKEN') {
      return response.status(401).json({
        code: error.code,
        message: 'The jwt must be provided'
      })
    }

    if (error.code === 'E_MISSING_DATABASE_ROW') {
      return response.status(404).json({
        code: error.code,
        message: 'Resource not found'
      })
    }

    if (error.code === 'E_ROUTE_NOT_FOUND') {
      return response.status(404).json({
        code: error.code,
        message: 'Route not found'
      })
    }

    if (error.code === 'HTTP_FORBIDDEN') {
      return response.status(403).json({
        code: error.code,
        message: 'Access forbidden. You are not allowed to this resource.'
      })
    }

    if (error.code === 'E_PASSWORD_MISMATCH') {
      return response.status(422).json({
        code: error.code,
        message: 'Cannot verify user password'
      })
    }

    return super.handle(...arguments)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler

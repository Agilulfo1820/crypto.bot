'use strict'

const { ServiceProvider } = require('@adonisjs/fold');

class DateFormatValidator extends ServiceProvider {
    /**
     * Register namespaces to the IoC container
     *
     * @method register
     *
     * @return {void}
     */
    register() {
        //
    }

    /**
     * Attach context getter when all providers have
     * been registered
     *
     * @method boot
     *
     * @return {void}
     */
    boot() {
        const Validator = use('Validator');
        const Moment = use("moment");

        Validator.extend('checkDateFormat', async function(data, field, message, args, get) {
            const value = get(data, field);
            if (!value) {
                return;
            }

            const valid = Moment(value, "YYYY-MM-DD HH:mm:ss", true);


            if (valid.isValid() === false) {
                throw message;
            }
        });
    }
}
module.exports = DateFormatValidator;
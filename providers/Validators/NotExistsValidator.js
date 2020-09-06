'use strict'

const { ServiceProvider } = require('@adonisjs/fold');

class NotExistsValidator extends ServiceProvider {
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
        const Database = use('Database');
        Validator.extend('notExists', async function(data, field, message, args, get) {
            const value = get(data, field);
            if (!value) {
                return;
            }
            const [table, column] = args;

            let query = Database.table(table)
                .where(column, value)

            const row = await query.first();

            if (row) {
                throw column + ' already exists';
            }
        });
    }
}
module.exports = NotExistsValidator;
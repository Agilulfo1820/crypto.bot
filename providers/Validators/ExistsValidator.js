'use strict'

const { ServiceProvider } = require('@adonisjs/fold');

class ExistsValidator extends ServiceProvider {
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
        Validator.extend('exists', async function(data, field, message, args, get) {
            const value = get(data, field);
            if (!value) {
                throw 'Cannot Find ' + column + 'in ' + table;
            }
            const [table, column, column2, column2Value, column3, column3Value] = args;

            let query = Database.table(table)
                .where(column, value)

            if (column2 &&  typeof column2Value !== 'undefined') {
                query = query.andWhere(column2, column2Value)
            }

            if (column3 && typeof column3Value !== 'undefined') {
                query = query.andWhere(column3, column3Value)
            }

            const row = await query.first();

            if (!row) {
                throw 'Cannot Find ' + column + ' in ' + table;
            }
        });
    }
}
module.exports = ExistsValidator;
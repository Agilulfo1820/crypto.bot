'use strict'

const Task = use('Task')
const Queue = use('Queue')
const Job = use('App/Jobs/Producers/TDSequentialJob')
const Strategy = use('App/Models/Strategy')
const Indicator = use('App/Models/Indicator')
const Config = use('Config')
const constants = Config.get('constants')

class TdSequentialStrategy extends Task {
    static get schedule() {
        // Schedule cronjob to run every minute
        return '*/1 * * * *'
    }

    async handle() {
        /**
         * TODO
         * 1. Get strategies with this indicator
         * 2. Subdivide in jobs for each strategy
         */

        const indicator = await Indicator.query()
            .where('slug', constants.TD_INDICATOR)
            .first()

        let strategies = await Strategy.query()
            .where('indicator_id', indicator.id)
            .where('is_active', true)
            .fetch()

       // const today = new Date();

        strategies = strategies.toJSON()
        strategies.forEach((strategy) => {
            //TODO: check that strategy wasn't already executed

            // let lastLog = await strategy.logs().last()
            // let timeframe = await strategy.timeframe().fetch()
            // let x = today.setDate(today.getDate() - 1);
            // if(lastLog.created_at )

            Queue.dispatch(new Job({strategy: strategy}), 'now');
        })
    }
}

module.exports = TdSequentialStrategy

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

    /**
     * Get strategies with this indicator
     * Check that strategy wasn't already executed in it's timeframe
     * Subdivide in jobs for each strategy
     */
    async handle() {
        const indicator = await Indicator.query()
            .where('slug', constants.TD_INDICATOR)
            .first()

        let strategies = await Strategy.query()
            .where('indicator_id', indicator.id)
            .where('is_active', true)
            .fetch()

        strategies = strategies.toJSON()
        for (const s of strategies) {
            // Check that strategy wasn't already executed
            const strategy = await Strategy.findOrFail(s.id)

            let timeframe = await strategy.timeframe().fetch()
            let timeFrameDate = this.getDateFromTimeframe(timeframe.value, timeframe.range)
            let lastStrategyLog = await strategy.logs().last()

            // Execute strategy only if it's first time or timeframe has passed
            if (!lastStrategyLog || (lastStrategyLog && lastStrategyLog.created_at <= timeFrameDate)) {
                Queue.dispatch(new Job({strategy: strategy}), 'now');
            } else {
                console.log('Strategy ' + strategy.name + ' was already executed!')
            }
        }
    }

    getDateFromTimeframe = (value, range) => {
        const today = new Date()

        let timestamp
        switch (range) {
            case 'm':
                let minutes = value * 60 * 1000; /* ms */
                timestamp = new Date(today.getTime() - minutes)
                break
            case 'h':
                let hours = value * 60 * 60 * 1000; /* ms */
                timestamp = new Date(today.getTime() - hours)
                break
            case 'd':
                timestamp = today.setDate(today.getDate() - value);
                break
        }

        return new Date(timestamp)
    }
}

module.exports = TdSequentialStrategy

'use strict'

const Task = use('Task')
const Queue = use('Queue')
const Job = use('App/Jobs/Producers/TDSequentialJob')

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

        Queue.dispatch(new Job({'data': 'whatever'}), 'now');
    }
}

module.exports = TdSequentialStrategy

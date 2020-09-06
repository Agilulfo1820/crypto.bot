'use strict'

/*
|--------------------------------------------------------------------------
| Run Scheduler
|--------------------------------------------------------------------------
|
| Run the scheduler on boot of the web sever.
|
*/
const Scheduler = use('Adonis/Addons/Scheduler')
Scheduler.run()
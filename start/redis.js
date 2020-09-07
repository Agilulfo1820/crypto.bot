'use strict'

/*
|--------------------------------------------------------------------------
| Redis Subscribers
|--------------------------------------------------------------------------
|
| Here you can register the subscribers to redis channels. Adonis assumes
| your listeners are stored inside `app/Listeners` directory.
|
*/

const Redis = use('Redis')

/**
 * Inline subscriber
 */
// Redis.subscribe('news', async () => {
// })
Redis.on('error', console.log)

/**
 * Binding method from a module saved inside `app/Listeners/News`
 */
// Redis.subcribe('news', 'News.onMessage')

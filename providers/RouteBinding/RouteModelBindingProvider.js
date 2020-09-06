const { ServiceProvider } = require('@adonisjs/fold');

async function bindMiddleware(request, next, [model, key, identifier, lookupField = 'id']) {
    const identifierValue = request.params[identifier];
    if (identifierValue && lookupField) {
        request[key] = await use(model).findByOrFail(lookupField, identifierValue);
    }

    await next();
}

class RouteModelBindingProvider extends ServiceProvider {
    boot() {
        const Route = use('Route');
        const Server = use('Server');
        Server.registerNamed({ bm: bindMiddleware });
        // Add macro
        Route.Route.macro('bind', function (model, key, identifier, lookupField) {
            this.middleware(`bm:${model},${key},${identifier},${lookupField}`);
            return this
        })
    }
}

module.exports = RouteModelBindingProvider;

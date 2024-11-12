const fastifyPlugin = require('fastify-plugin');
const servicePlugin = require('./services/servicePlugin');
const repositoryPlugin = require('./repositories/repositoryPlugin');

async function app(fastify,option) {
    
    await fastify.register(require('@fastify/cors'));
    
    await fastify.register(repositoryPlugin);

    await fastify.register(servicePlugin);

    fastify.get('/', async (request, reply) => {
        return { status: 'alive' };
    });

    await fastify.register( require("./routes/api/apiRoutes"), {prefix : '/api'} );


}

module.exports = fastifyPlugin(app);    // APP function becomes fastify plugin and afterwards we need to register this plugin with fastify instance

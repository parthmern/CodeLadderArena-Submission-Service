const testController = require("../../../../controllers/testController");

async function testRoute(fastify) {
    fastify.get('/ping', testController.pingRequest);
}

module.exports = testRoute;
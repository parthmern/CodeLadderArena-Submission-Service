const { createSubmission, pingRequest } = require("../../../controllers/submissionController.js");

async function submissionRoutes(fastify, options) {
    fastify.post('/', createSubmission);
    fastify.get('/ping', pingRequest);
}

module.exports = submissionRoutes;
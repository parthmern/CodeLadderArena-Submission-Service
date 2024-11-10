const { createSubmission } = require("../../../controllers/submissionController.js");

async function submissionRoutes(fastify, options) {
    fastify.post('/', createSubmission);
}

module.exports = submissionRoutes;
const SubmissionRepository = require('./submissionRepository');
const fastifyPlugin = require('fastify-plugin');

async function repopsitoryPlugin(fastify, options) {
    const submissionRepo = new SubmissionRepository();
    fastify.decorate('submissionRepository', submissionRepo);
}

module.exports = fastifyPlugin(repopsitoryPlugin);
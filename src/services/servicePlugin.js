const fastifyPlugin = require("fastify-plugin");
const SubmissionService = require("./submissionService");

async function servicePlugin(fastify, option) {

    const submissionService = new SubmissionService(fastify.submissionRepository);    
    fastify.decorate('submissionService', submissionService)

}

module.exports = fastifyPlugin(servicePlugin); 
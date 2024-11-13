const fastifyPlugin = require('fastify-plugin');
const servicePlugin = require('./services/servicePlugin');
const repositoryPlugin = require('./repositories/repositoryPlugin');
const SubmissionRepository = require('./repositories/submissionRepository');

async function app(fastify, option) {

    await fastify.register(require('@fastify/cors'));

    await fastify.register(repositoryPlugin);

    await fastify.register(servicePlugin);

    fastify.get('/', async (request, reply) => {
        return { status: 'alive' };
    });

    fastify.post('/evaluted', async (request, reply) => {
        try {
            const payload = request.body;

            console.log('Received payload:', payload);

            console.log("Job data:", payload);

            // Updating submission status in DB
            const submissionRepo = new SubmissionRepository();
            const res = await submissionRepo.updateSubmission(payload);
            console.log("Submission update response====>", res);

            // Sending payload to another service
            console.log("hitting /sendPayload");
            const response = await axios.post(`${SOCKET_SERVICE_URL}/sendPayload`, {
                userId: payload.userId,
                payload: payload.data
            });
            console.log("Payload sent:", response?.data);
            
            return reply.status(200).send({
                status: 'success',
                message: 'Request was evaluated successfully',
            });
        }
        catch (error) {
            return reply.status(500).send({
                status: 'error',
                message: 'An error occurred while evaluating the request',
            });

        }
    })

    await fastify.register(require("./routes/api/apiRoutes"), { prefix: '/api' });


}

module.exports = fastifyPlugin(app);    // APP function becomes fastify plugin and afterwards we need to register this plugin with fastify instance

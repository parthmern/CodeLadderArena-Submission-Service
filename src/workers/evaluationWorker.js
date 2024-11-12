const { Worker } = require('bullmq');
const redisConnection = require('../config/redisConfig');
const axios = require('axios');
const { updateSubmission } = require('../controllers/submissionController');
const SubmissionRepository = require('../repositories/submissionRepository');
const { SOCKET_SERVICE_URL } = require('../config/serverConfig');

function evaluationWorker(queue) {
    console.log('Worker initialized');
    new Worker('EvaluationQueue', async job => {
        console.log("EvaluationQueue ==> job.name ==>", job.name);
        if (job.name === 'EvaluationJob') {

            console.log("EvaluationQueue ==> job.name ==>", job.name);

            // updating submission status in DB

            const submissionRepo = new SubmissionRepository();
            const res = await submissionRepo.updateSubmission(job.data);
            console.log("res====>", res);

            const response = await axios.post(`${SOCKET_SERVICE_URL}/sendPayload`, {
                userId: job.data.userId,
                payload: job.data
            })
            console.log("sending payload ...");
            console.log(response?.data);
            console.log(job.data);

        }
    }, {
        connection: redisConnection,
        concurrency: 5 
    });
}

module.exports = evaluationWorker;
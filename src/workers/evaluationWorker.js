const { Worker } = require('bullmq');
const redisConnection = require('../config/redisConfig');
const axios = require('axios');
const { updateSubmission } = require('../controllers/submissionController');
const SubmissionRepository = require('../repositories/submissionRepository');
const { SOCKET_SERVICE_URL } = require('../config/serverConfig');
async function evaluationWorker(queue) {
    new Worker('EvaluationQueue', async (job) => {
        console.log("EvaluationQueue====EvaluationJob===>", job.name);
        
        if (job.name === 'EvaluationJob') {
            try {
                console.log("Job data:", job.data);

                // Updating submission status in DB
                const submissionRepo = new SubmissionRepository();
                const res = await submissionRepo.updateSubmission(job.data);
                console.log("Submission update response====>", res);

                // Sending payload to another service
                const response = await axios.post(`${SOCKET_SERVICE_URL}/sendPayload`, {
                    userId: job.data.userId,
                    payload: job.data
                });
                console.log("Payload sent:", response?.data);

            } catch (error) {
                console.error("Error processing job:", error);
            }
        }
    }, {
        connection: redisConnection,
        concurrency: 5,  // Limit concurrency for debugging or scaling
    });
}

module.exports = evaluationWorker;

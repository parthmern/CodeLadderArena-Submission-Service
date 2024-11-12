const { Worker } = require('bullmq');
const redisConnection = require('../config/redisConfig');
const axios = require('axios');
const { updateSubmission } = require('../controllers/submissionController');
const SubmissionRepository = require('../repositories/submissionRepository');
const { SOCKET_SERVICE_URL } = require('../config/serverConfig');
// async function evaluationWorker(queue) {
//     const worker = new Worker('EvaluationQueue', async (job) => {
//         console.log("EvaluationQueue====EvaluationJob===>", job.name);

//         if (job.name === 'EvaluationJob') {
//             try {
//                 console.log("Job data:", job.data);

//                 // Updating submission status in DB
//                 const submissionRepo = new SubmissionRepository();
//                 const res = await submissionRepo.updateSubmission(job.data);
//                 console.log("Submission update response====>", res);

//                 // Sending payload to another service
//                 const response = await axios.post(`${SOCKET_SERVICE_URL}/sendPayload`, {
//                     userId: job.data.userId,
//                     payload: job.data
//                 });
//                 console.log("Payload sent:", response?.data);

//             } catch (error) {
//                 console.error("Error processing job:", error);
//             }
//         }
//     }, {
//         connection: redisConnection,
//         concurrency: 5,  // Limit concurrency for debugging or scaling
//         stalledInterval: 30000, // Check for stalled jobs every 30 seconds
//         maxStalledCount: 3, // Consider a job stalled after 3 checks    
//     });

//     worker.on('ready', () => {
//         console.log('Worker is ready to process jobs');
//     });

//     worker.on('error', (error) => {
//         console.error('Worker encountered an error:', error);
//     });

//     worker.on('failed', (job, err) => {
//         console.error(`Job ${job.id} failed with error:`, err);
//     });

//     worker.on('completed', (job) => {
//         console.log(`Job ${job.id} completed successfully`);
//     });

//     worker.on('stalled', (jobId) => {
//         console.warn(`Job ${jobId} has stalled`);
//     });

//     return worker;

// }

// module.exports = evaluationWorker;



function evaluationWorker(queueName) {
    new Worker(
        queueName,
        async (job) => {
            try {
                console.log("EvaluationQueue job worker kicking", job?.id);
                if (job.name === "EvaluationJob") {

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

                    return true;
                }
            } catch (error) {
                console.log("submission worker error", error);
                return false;
            }
        },
        {
            connection: redisConnection
        }
    );
}

module.exports = evaluationWorker;
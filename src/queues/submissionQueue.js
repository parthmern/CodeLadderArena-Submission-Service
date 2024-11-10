const { Queue } = require('bullmq');

const redisConnection = require('../config/redisConfig');

let submissionQueue;
try {
    submissionQueue = new Queue('SubmissionQueue', { connection: redisConnection });
    console.log("✅ SubmissionQueue created successfully");
} catch (error) {
    console.error("❌ Error creating SubmissionQueue:", error);
}

module.exports = submissionQueue;
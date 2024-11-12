const { Queue, Worker } = require('bullmq');
const app = require('./app');
const connectToDB = require('./config/dbConfig');
const { PORT } = require('./config/serverConfig');
const evaluationWorker = require('./workers/evaluationWorker');
const redisConnection = require('./config/redisConfig');
const Redis = require('ioredis');
const redis = new Redis();

const fastify = require('fastify')({logger: false});

fastify.register(app);  // registering plugin "app"

fastify.listen({ port: PORT, host: '0.0.0.0' }, async (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    
    await connectToDB();
    console.log(`💚 Submission service started at ${PORT}`);

    //await evaluationWorker();

    const queue = new Queue('EvaluationQueue', { connection: redisConnection });

    // Listen for jobs added to the queue using BullMQ
    queue.on('waiting', (jobId) => {
        console.log(`New job added to the queue with ID: ${jobId}`);
    });

    // Start monitoring the queue using Redis BLPOP in a separate function
    monitorQueue();

    const worker = new Worker('EvaluationQueue', async (job) => {
      console.log("woekrr1 Processing job:", job.name);
      if (job.name === 'EvaluationJob') {
        try {
          console.log("Job data:", job.data);
    
          // Process the job here (e.g., update DB, send data to another service, etc.)
          // Example: Send payload to another service or process it
          // const response = await axios.post(SOCKET_SERVICE_URL, job.data);
          // console.log('Payload sent to another service:', response.data);
          
        } catch (error) {
          console.error('Error processing job:', error);
        }
      }
    }, { connection: redisConnection });

    const worker2 = new Worker('EvaluationQueue', async (job) => {
      console.log("woekrr2 Processing job:", job.name);
      if (job.name === 'EvaluationJob') {
        try {
          console.log("Job data:", job.data);
    
          // Process the job here (e.g., update DB, send data to another service, etc.)
          // Example: Send payload to another service or process it
          // const response = await axios.post(SOCKET_SERVICE_URL, job.data);
          // console.log('Payload sent to another service:', response.data);
          
        } catch (error) {
          console.error('Error processing job:', error);
        }
      }
    }, { connection: redisConnection });
    
    // Event listener to log when the worker is ready
    worker.on('ready', () => {
      console.log('Worker is ready to process jobs');
    });
    worker2.on('ready', () => {
      console.log('Worker2 is ready to process jobs');
    });
    
    // Event listener for when the job completes
    worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed successfully`);
    });

    worker2.on('completed', (job) => {
      console.log(`Job ${job.id} completed successfully`);
    });
    
    // Event listener for when the job fails
    worker.on('failed', (job, err) => {
      console.error(`Job ${job.id} failed with error:`, err);
    });
    


})




// Function to monitor Redis queue using BLPOP
async function monitorQueue() {
    const queueName = 'EvaluationQueue';
    
    while (true) {
        console.log("Monitoring Redis Queue...");
        // Use Redis `BLPOP` to listen for new items added to the queue
        const job = await redis.blpop(queueName, 0); // '0' means block indefinitely until a job is added
        console.log(`New job detected by BLPOP:`, job);
    }
}


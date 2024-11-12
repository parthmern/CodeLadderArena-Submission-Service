const { Queue } = require('bullmq');
const app = require('./app');
const connectToDB = require('./config/dbConfig');
const { PORT } = require('./config/serverConfig');
const evaluationWorker = require('./workers/evaluationWorker');
const redisConnection = require('./config/redisConfig');

const fastify = require('fastify')({logger: false});

fastify.register(app);  // registering plugin "app"

fastify.listen({ port: PORT, host: '0.0.0.0' },async (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    
    await connectToDB();
    console.log(`💚 Submission service started at ${PORT}`);

    //evaluationWorker('EvaluationQueue');
    
})
  

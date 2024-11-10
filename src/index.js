const app = require('./app');
const connectToDB = require('./config/dbConfig');
const { PORT } = require('./config/serverConfig');
const evaluationWorker = require('./workers/evaluationWorker');

const fastify = require('fastify')({logger: true});

fastify.register(app);  // registering plugin "app"

fastify.listen({ port: PORT },async (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    
    await connectToDB();
    console.log(`💚 Submission service started at ${PORT}`);

    evaluationWorker('EvaluationQueue');
})
  

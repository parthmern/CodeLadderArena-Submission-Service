const app = require('./app');
const connectToDB = require('./config/dbConfig');
const { PORT } = require('./config/serverConfig');
const evaluationWorker = require('./workers/evaluationWorker');

const fastify = require('fastify')({logger: true});

fastify.register(app);  // registering plugin "app"

// add '0.0.0.0' to accesible from everywhere especially in Fastify
fastify.listen({ port: PORT }, '0.0.0.0' ,async (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    
    await connectToDB();
    console.log(`💚 Submission service started at ${PORT}`);

    evaluationWorker('EvaluationQueue');
})
  

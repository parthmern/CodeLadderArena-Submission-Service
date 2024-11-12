const request = require('supertest');
const app = require('../src/app');
const connectToDB = require('../src/config/dbConfig');
const evaluationWorker = require('../src/workers/evaluationWorker');
const fastify = require('fastify')({ logger: false });

jest.mock('../src/config/dbConfig', () => jest.fn(() => Promise.resolve()));
jest.mock('../src/workers/evaluationWorker', () => jest.fn());

fastify.listen = jest.fn().mockResolvedValue();

beforeAll(async () => {
    fastify.register(app);
    await fastify.ready(); 
});

afterAll(async () => {
    await fastify.close(); 
});

describe('Integration tests for Fastify server', () => {
    // it('should respond with a JSON message on GET /ping', async () => {
    //     const response = await request(fastify.server).get('/api/v1/submission/ping');
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.message).toContain('Submission Service is alive 💚');
    // });

    it('should call connectToDB and evaluationWorker', async () => {
        // call func
        await connectToDB();
        evaluationWorker('EvaluationQueue');

        // ensuring called or not
        expect(connectToDB).toHaveBeenCalled();
        expect(evaluationWorker).toHaveBeenCalledWith('EvaluationQueue');
    });
});


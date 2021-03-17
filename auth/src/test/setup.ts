import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  // setup mongodb in memory
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// app;

beforeEach(async () => {
  // so before each new test we will reset the mongo database
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// creating global function for all our tests
global.signin = async () => {
  const email = 'test@test.com';
  const password = '123456';

  const response = await request(app)
    .post('/api/users/signup')

    .send({ email: 'test@test.com', password: '123456' })
    .expect(201);
  const cookie = response.get('Set-Cookie');

  return cookie;
};

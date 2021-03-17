import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return (
    request(app) // passing in our app to run
      .post('/api/users/signup') // the route and method to test
      // specifiy body info
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201)
  );
});

it('Returns a status code of 400 with invalid email', async () => {
  return (
    request(app) // passing in our app to run
      .post('/api/users/signup') // the route and method to test
      // specifiy body info
      .send({
        email: 'testtest.com',
        password: '123456',
      })
      .expect(400)
  );
});

it('Returns a status code of 400 with invalid password', async () => {
  return (
    request(app) // passing in our app to run
      .post('/api/users/signup') // the route and method to test
      // specifiy body info
      .send({
        email: 'test@test.com',
        password: '',
      })
      .expect(400)
  );
});

it('Returns a status code of 400 with invalid password and email', async () => {
  await request(app) // passing in our app to run
    .post('/api/users/signup') // the route and method to test
    // specifiy body info
    .send({})
    .expect(400);

  await request(app) // passing in our app to run
    .post('/api/users/signup') // the route and method to test
    // specifiy body info
    .send({ email: 'test' })
    .expect(400);
});

// if you try ssign up twice with same email, things shouldn't work
it('Disallows duplicate emails in our db', async () => {
  await request(app) // passing in our app to run
    .post('/api/users/signup') // the route and method to test
    // specifiy body info
    .send({ email: 'test@test.com', password: '123456' })
    .expect(201);

  await request(app) // passing in our app to run
    .post('/api/users/signup') // the route and method to test
    // specifiy body info
    .send({ email: 'test@test.com', password: '123456' })
    .expect(400);
});

// check if cookie present in response
it('sets a cokkie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')

    .send({ email: 'test@test.com', password: '123456' })
    .expect(201);
  // response.get() allows us to access headers in response
  // toBeDefined returns whether the header is defined or not
  expect(response.get('Set-Cookie')).toBeDefined();
});

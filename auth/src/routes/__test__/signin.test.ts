import request from 'supertest';
import { app } from '../../app';

it('Error when trying to signin with non existent email', async () => {
  await request(app)
    .post('/api/users/signin')
    // specifiy body info
    .send({
      email: 'test@test.com',
      password: '123456',
    })
    .expect(400);
});

// after creating an account, passing in an incorrect password to signin should fail
it('Error when trying to signin with correct email but incorrect password given', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '1234567',
    })
    .expect(400);
});

// after creating an account, passing in an incorrect password to signin should fail
it('Responds with cookie when user signs in successfully', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '123456',
    })
    .expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});

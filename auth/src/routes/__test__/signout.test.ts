import request from 'supertest';
import { app } from '../../app';

it('Clears cookie after sign out', async () => {
  const signUpResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456',
    })
    .expect(201);

  const signOutResponse = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
  // ensuring that the two cookies aren't equal after a user signs out
  expect(signUpResponse.get('Set-Cookie')).not.toEqual(
    signOutResponse.get('Set-Cookie')
  );
});

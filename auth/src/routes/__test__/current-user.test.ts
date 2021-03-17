import request from 'supertest';
import { app } from '../../app';

// after creating an account, passing in an incorrect password to signin should fail
it('Responds with details about the current user', async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie) // the .set() allows us to add headers to our requests
    .send()
    .expect(200);

  // making sure the req email in our currentUser is the same as our signin email
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

// current user should return null if user is not logged in
it('Responds with current user=null if not authenticated', async () => {
  // const cookie = await global.signin();
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});

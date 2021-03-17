import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true); // so express is aware its behind the nginx ingress proxy
app.use(json());
app.use(
  cookieSession({
    // we arent encrypting our cookie as the JWT within it is encrypted
    // this also means that wif we incorporate other programming languages into different services
    // there wont be any decrytion issues
    signed: false,
    // when true this means we will only set a cookie on https connection
    // when we run jest tests, it will change node_env to test, so we will be able to set a cookie on non secure http
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
// so any route that isn't defined above will throw this error
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };

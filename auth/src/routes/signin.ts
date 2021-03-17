import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../utils/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email Must be valid'),
    body('password').trim().notEmpty().withMessage('Must Supply A Password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      // we throw this generic error to not give potentially malicious users too much info on why it failed
      throw new BadRequestError('Invalid User Credentials');
    }

    // we are calling the password match method we created
    // will return a boolean
    const passwordsMatch = await Password.compare(
      existingUser.password, // compare db password with password passed in
      password
    );

    // if passwords fail to match, throw an error
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid User Credentials');
    }

    // if req reaches this stage, users have logged in
    // so we can give user a token
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // store jwt on session object
    req.session = {
      jwt: userJwt,
    };
    // send back existing user object
    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };

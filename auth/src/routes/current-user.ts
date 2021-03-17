import express from 'express';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

// this route handle will let the react app know whether the current user is logged in

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

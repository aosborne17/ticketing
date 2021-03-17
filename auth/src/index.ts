import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  // make sure our env variables are defined before we even start the app

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined');
  }

  // we putting in the name of the cluster service IP so we can access our mongo database on K8
  // we then pass in the port that our DB is running on
  // lasty we can pass in a name of the database we want to connect to
  // if there is no db with such name, mongo will create it
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error Connecting to db', err);
  }
  // after we have connected to the db, we can listen for requests
  app.listen(3000, () => {
    console.log('Listening on 3000');
  });
};

start();

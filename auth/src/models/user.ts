import mongoose from 'mongoose';
import { Password } from '../utils/password';

// An interface that describes properties required to create a new user

interface UserAttrs {
  email: string;
  password: string;
}

// An interface which describes the properties that a user model has

interface UserModel extends mongoose.Model<UserDoc> {
  // when we 'build a user, it should return a UserDocument
  build(attrs: UserAttrs): UserDoc;
}

// An interface to describee the properties a user document has 'a single user'
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // createdAt: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // doc is user document
      // ret is the thing turned into json
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// use function instead of arrow func as it gives us access to the user document
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    // we will get the users password off the document that is about to be saved and pass it to our hash method
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  //we must call this at the end as mongoose struggles to understand async calls
  done();
});

// this allows us to attach the build function to our userSchema
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

Password;

// we are passing in the new interface we have created,
// we are letting mongo know that the User model will have a function called build
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// by calling this function instead of new User directly
// it ensures that the the arguements we pass in are correct as we have created an interface to check
// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

// User.build({
//   email: 'hey',
//   password: 'test',
//   we will get an error below as we are trying to add a property not defined in our interface
//   score: 5
// });

export { User };

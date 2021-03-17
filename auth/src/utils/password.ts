import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// turning callback implementation to promised back
const scryptAsync = promisify(scrypt);

// statis methods allow us to call them without making an instance of a class
// e.g. we can do Password.toHash()

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex'); // generate salt
    const buf = (await scryptAsync(password, salt, 64)) as Buffer; // simply telling typscript that the 'buf variable is simply a buffer

    return `${buf.toString('hex')}.${salt}`; // then return the hash password (buf) with the salt
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    // we seperated the hashed password and the salt with a dot, so we can split the sting to get both results
    const [hashedPassword, salt] = storedPassword.split('.');

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer; // simply telling typscript that the 'buf variable is simply a buffer

    // we are checking the equality between the supplied password and our stored password
    return buf.toString('hex') === hashedPassword;
  }
}

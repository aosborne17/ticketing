// general purpose error when something goes wrong

import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(public errorMessage: string) {
    super(errorMessage);

    // only when extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeErrors() {
    return [{ message: this.errorMessage }];
  }
}

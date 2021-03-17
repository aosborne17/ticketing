import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  reason = 'Route Not Found';
  constructor() {
    super('URL Not Found');

    // only when extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  statusCode = 404;

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

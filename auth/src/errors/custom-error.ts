// creating an abstract class
// it is acting just like an interface but it allows us to to the instanceOf check as classes compile down to js in runtime
// however interfaces just vanish

export abstract class CustomError extends Error {
  // so for a class to extend this abstract class, it must have a status code property, which is a number
  abstract statusCode: number;
  constructor(message: string) {
    super(message);

    // only when extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // so also, for a class to extend this custom error class, it must have a serializeErrors method
  // this method should return an array of objects with the property message and OPTIONALLY a field property
  abstract serializeErrors(): { message: string; field?: string }[];
}

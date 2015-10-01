import ExtendableError from './extendable_error';

export default class ValidationError extends ExtendableError {
  constructor(error) {
    super('validation error');
    this.error = error;
  }

  getError () {
    return this.error;
  }
}

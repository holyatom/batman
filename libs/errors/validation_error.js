export default class ValidationError extends Error {
  constructor(error) {
    super('validation error');
    this.error = error;
  }

  getError () {
    return this.error;
  }
}

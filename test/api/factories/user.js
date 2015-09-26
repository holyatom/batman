import Factory from 'test/api/factories';
import User from 'server/models/user';
import Auth from 'server/controllers/auth';


class UserFactory extends Factory {
  constructor () {
    super();
    this.postUrl = '/api/users';
  }

  defaults () {
    return {
      username: `testuser${this.counter}`,
      password: 123456,
      full_name: `Test User${this.counter}`
    };
  }

  postCreate (item) {
    return new Promise((resolve, reject) => {
      item.token = Auth.prototype.generateToken(item);
      resolve(item);
    });
  }
}

export default new UserFactory();

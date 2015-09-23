import Factory from 'test/factories';
import User from 'server/models/user';
import Auth from 'server/controllers/auth';


class UserFactory extends Factory {
  constructor () {
    super();
    this.Model = User;
  }

  defaults () {
    return {
      username: `testuser${this.counter}`,
      password: 123456,
      created: new Date(),
      full_name: `Test User${this.counter}`,
      image_url: '/images/default_avatar.jpg',
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

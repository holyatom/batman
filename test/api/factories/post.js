import Factory from 'test/api/factories';


class PostFactory extends Factory {
  constructor () {
    super();
    this.postUrl = '/api/users/profile/posts';
  }

  defaults () {
    return {
      description: `testdescription${this.counter}`,
      address: `testaddress${this.counter}`,
      image_urls: ['http://1', 'http://2'],
      location_name: `testlocation${this.counter}}`,
    };
  }
}

export default new PostFactory();

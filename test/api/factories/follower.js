import chai from 'chai';
import Factory from 'test/api/factories';


class FollowerFactory extends Factory {
  post (app, data) {
    return new Promise((resolve, reject) => {
      let follower = data.follower;
      let followee = data.followee;
      let url = `/api/users/profile/following/${followee.username}`;

      chai.request(app)
        .post(url)
        .set('X-Access-Token', follower.token.value)
        .then(res => resolve({ req: data, res }))
        .catch(err => reject(err));
    });
  }
}

export default new FollowerFactory();

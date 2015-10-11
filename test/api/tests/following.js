import _ from 'lodash';
import chai from 'chai';
import server from 'server';
import { setup } from '../setup';
import userFactory from '../factories/user';


let followingUrl = '/api/users/:username/following';
let followersUrl = '/api/users/:username/followers';

describe('Following API', () => {
  before(done => {
    setup(server, () => {
      userFactory.create(server.app)
        .then(user => {
          server.app.env.followee = user;
          done();
        })
        .catch(err => {
          console.log(err);
          done(err);
        });
    })
  });

  it('POST /api/users/profile/following/:username should make current user follow :username', done => {
    var env = server.app.env;
    chai.request(server.app)
      .post(`${followingUrl.replace(':username', 'profile')}/${env.followee.username}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.success.should.equal(true);
        done();
      })
      .catch(err => done(err));
  });

  it('POST /api/users/profile/following/:username if :username is already followed should return 409', done => {
    var env = server.app.env;
    chai.request(server.app)
      .post(`${followingUrl.replace(':username', 'profile')}/${env.followee.username}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(409);
        res.body.error.code.should.equal('already_followed');
        done();
      })
      .catch(err => done(err));
  });

  it('POST /api/users/profile/following/:username if :username is current user should return 409', done => {
    var env = server.app.env;
    chai.request(server.app)
      .post(`${followingUrl.replace(':username', 'profile')}/${env.user.username}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(409);
        res.body.error.code.should.equal('follower_equals_followee');
        done();
      })
      .catch(err => done(err));
  });

  it('POST /api/users/:username/following/:followee_username if :username is not \'profile\' should return 404', done => {
    var env = server.app.env;
    chai.request(server.app)
      .post(`${followingUrl.replace(':username', env.followee.username)}/${env.user.username}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(404);
        res.body.error.code.should.equal('not_found');
        done();
      })
      .catch(err => done(err));
  });

  it('GET /api/users/:username/following should return followees of :username', done => {
    var env = server.app.env;
    chai.request(server.app)
      .get(`${followingUrl.replace(':username', env.user.username)}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.total.should.equal(1);
        res.body.page.should.equal(1);
        res.body.per_page.should.equal(20);
        res.body.collection.should.deep.equal([{
          _id: env.followee._id,
          full_name: env.followee.full_name,
          username: env.followee.username,
          image_url: env.followee.image_url,
        }]);
        done();
      })
      .catch(err => done(err));
  });

  it('GET /api/users/:username/following/count should return count of followees of :username', done => {
    var env = server.app.env;
    chai.request(server.app)
      .get(`${followingUrl.replace(':username', env.user.username)}/count`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.count.should.equal(1);
        done();
      })
      .catch(err => done(err));
  });

  it('GET /api/users/:username/followers should return followers of :username', done => {
    var env = server.app.env;
    chai.request(server.app)
      .get(`${followersUrl.replace(':username', env.followee.username)}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.total.should.equal(1);
        res.body.page.should.equal(1);
        res.body.per_page.should.equal(20);
        res.body.collection.should.deep.equal([{
          _id: env.user._id,
          full_name: env.user.full_name,
          username: env.user.username,
          image_url: env.user.image_url,
        }]);
        done();
      })
      .catch(err => done(err));
  });

  it('GET /api/users/:username/followers/count should return count of followers of :username', done => {
    var env = server.app.env;
    chai.request(server.app)
      .get(`${followersUrl.replace(':username', env.followee.username)}/count`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.count.should.equal(1);
        done();
      })
      .catch(err => done(err));
  });

  it ('GET /api/users/:followee_username should return user card with is_followed equal true', done => {
    var env = server.app.env;
    chai.request(server.app)
      .get(`/api/users/${env.followee.username}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.is_followed.should.equal(true);
        done();
      })
      .catch(err => done(err));
  });

  it ('GET /api/users should return list of users where followee has is_followed equal true', done => {
    var env = server.app.env;
    chai.request(server.app)
      .get(`/api/users`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        let followee = _.filter(res.body.collection, i => i.username === env.followee.username)[0];
        followee.is_followed.should.equal(true);
        done();
      })
      .catch(err => done(err));
  });

  it('DELETE /api/users/profile/following/:username if :username is current user should return 409', done => {
    var env = server.app.env;
    chai.request(server.app)
      .delete(`${followingUrl.replace(':username', 'profile')}/${env.user.username}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(409);
        res.body.error.code.should.equal('follower_equals_followee');
        done();
      })
      .catch(err => done(err));
  });

  it('DELETE /api/users/:username/following/:followee_username if :username is not \'profile\' should return 404', done => {
    var env = server.app.env;
    chai.request(server.app)
      .delete(`${followingUrl.replace(':username', env.followee.username)}/${env.user.username}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(404);
        res.body.error.code.should.equal('not_found');
        done();
      })
      .catch(err => done(err));
  });

  it('DELETE /api/users/profile/following/:username should make current user unfollow :username', done => {
    var env = server.app.env;
    chai.request(server.app)
      .delete(`${followingUrl.replace(':username', 'profile')}/${env.followee.username}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.success.should.equal(true);
        done();
      })
      .catch(err => done(err));
  });

  it('DELETE /api/users/profile/following/:username if :username is not followed should return 404', done => {
    var env = server.app.env;
    chai.request(server.app)
      .delete(`${followingUrl.replace(':username', 'profile')}/${env.followee.username}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(404);
        res.body.error.code.should.equal('not_found');
        done();
      })
      .catch(err => done(err));
  });
});

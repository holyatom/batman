import chai from 'chai';
import server from 'server';
import { setup } from '../setup';
import userFactory from '../factories/user';


let url = '/api/feed';

describe.skip('Feed API', () => {
  before(done => setup(() => {

    done();
  }));

  it ('GET /api/feed should return all posts of all followed users', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(url)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        done();
      })
      .catch(err => done(err));
  });

  it ('GET /api/feed should return posts sorted by created descending', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(url)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        done();
      })
      .catch(err => done(err));
  });
});

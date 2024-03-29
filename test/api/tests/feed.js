import _ from 'lodash';
import chai from 'chai';
import Q from 'q';
import server from 'server';
import { setup } from '../setup';
import userFactory from '../factories/user';
import followerFactory from '../factories/follower';
import postFactory from '../factories/post';


let url = '/api/feed';

describe('Feed API', () => {
  before(done => setup(server, () => {
    let env = server.app.env;
    Q.all([
      userFactory.create(server.app, { username: 'serik' }),
      userFactory.create(server.app, { username: 'berik' }),
      userFactory.create(server.app, { username: 'ivan' }),
    ])
    .then(([firstFollowee, secondFollowee, nonFollowee]) => {
      env.firstFollowee = firstFollowee;
      env.secondFollowee = secondFollowee;
      env.nonFollowee = nonFollowee;
    })
    .then(() => followerFactory.create(server.app, { follower: env.user, followee: env.firstFollowee }))
    .then(() => followerFactory.create(server.app, { follower: env.user, followee: env.secondFollowee }))
    .then(() => Q.all([
      postFactory.create(server.app, { description: 'party1', token: env.firstFollowee.token.value }),
      postFactory.create(server.app, { description: 'party2', token: env.firstFollowee.token.value }),
      postFactory.create(server.app, { description: 'party3', token: env.secondFollowee.token.value }),
      postFactory.create(server.app, { description: 'party4', token: env.nonFollowee.token.value }),
      postFactory.create(server.app, { description: 'party5', token: env.nonFollowee.token.value }),
    ]))
    .then(([party1, party2, party3, party4, party5]) => {
      env.party1 = party1;
      env.party2 = party2;
      env.party3 = party3;
      env.party4 = party4;
      env.party5 = party5;
      done();
    })
    .fail(done);
  }));

  it('GET /api/feed should return all posts of all followed users', done => {
    let env = server.app.env;
    _.forEach([env.party1, env.party2, env.party3], p => delete p.user_id);


    chai.request(server.app)
      .get(url)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.total.should.equal(3);
        res.body.collection.should.contain(env.party1);
        res.body.collection.should.contain(env.party2);
        res.body.collection.should.contain(env.party3);
        done();
      })
      .catch(done);
  });

  it('GET /api/feed should return posts ordered by created descending', done => {
    let env = server.app.env;
    let sortedPosts = _.sortBy([env.party1, env.party2, env.party3], i => -new Date(i.created));
    let sortedDates = _.pluck(sortedPosts, 'created');

    chai.request(server.app)
      .get(url)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        let resDates = _.pluck(res.body.collection, 'created');
        resDates.should.be.deep.equal(sortedDates);
        done();
      })
      .catch(done);
  });
});

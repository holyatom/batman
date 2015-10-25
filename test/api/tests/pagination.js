import chai from 'chai';
import server from 'server';
import { setup } from '../setup';
import userFactory from '../factories/user';


let url = '/api/users';

describe('Pagination', () => {
  before(done => {
    setup(server, () => {
      userFactory.create(server.app)
        .then(user => {
          server.app.env.secondUser = user;
          done();
        })
        .catch(err => {
          console.log(err);
          done(err);
        });
    });
  });

  it('GET /api/users?page=2&per_page=1 returns second page', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(`${url}?page=2&per_page=1`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.total.should.equal(2);
        res.body.page.should.equal(2);
        res.body.per_page.should.equal(1);
        res.body.collection.length.should.equal(1);
        done();
      })
      .catch(done);
  });


  it('GET /api/users page defaults to 1 and per_page defaults to 20', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(`${url}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.total.should.equal(2);
        res.body.page.should.equal(1);
        res.body.per_page.should.equal(20);
        res.body.collection.length.should.equal(2);
        done();
      })
      .catch(done);
  });

  it('GET /api/users?page=2 per_page defaults to 20', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(`${url}/?page=2`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.total.should.equal(2);
        res.body.page.should.equal(2);
        res.body.per_page.should.equal(20);
        res.body.collection.length.should.equal(0);
        done();
      })
      .catch(done);
  });

  it('GET /api/users?per_page=10 page defaults to 1', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(`${url}/?per_page=10`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.total.should.equal(2);
        res.body.page.should.equal(1);
        res.body.per_page.should.equal(10);
        res.body.collection.length.should.equal(2);
        done();
      })
      .catch(done);
  });

  it('GET /api/users?page=abc if non integer page returns validation error', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(`${url}/?page=abc`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(422);
        res.body.error.code.should.equal('validation_failed');
        res.body.error.fields.page.code.should.equal('bad_int_value');
        done();
      })
      .catch(done);
  });

  it('GET /api/users?page=0 if non positive page returns validation error', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(`${url}/?page=0`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(422);
        res.body.error.code.should.equal('validation_failed');
        res.body.error.fields.page.code.should.equal('less_than_allowed');
        done();
      })
      .catch(done);
  });

  it('GET /api/users?per_page=abc if non integer per_page returns validation error', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(`${url}/?per_page=abc`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(422);
        res.body.error.code.should.equal('validation_failed');
        res.body.error.fields.per_page.code.should.equal('bad_int_value');
        done();
      })
      .catch(done);
  });

  it('GET /api/users?per_page=0 if non positive per_page returns validation error', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(`${url}/?per_page=0`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(422);
        res.body.error.code.should.equal('validation_failed');
        res.body.error.fields.per_page.code.should.equal('less_than_allowed');
        done();
      })
      .catch(done);
  });

  it('GET /api/users?per_page=101 if per_page exceeds 100 returns validation error', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(`${url}/?per_page=101`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(422);
        res.body.error.code.should.equal('validation_failed');
        res.body.error.fields.per_page.code.should.equal('more_than_allowed');
        done();
      })
      .catch(done);
  });
});

import chai from 'chai';
import chaiHttp from 'chai-http';
import bodyParser from 'body-parser';
import server, { app } from 'server';
import middlewares from '../../server/middlewares';


let should = chai.should();

describe('API status', () => {
  before(() => {
    chai.use(chaiHttp);

    app.use(bodyParser.json());
    app.use(middlewares.lang);
    app.use(middlewares.jwt);

    server.initControllers();
  });

  it('GET /api/status should return batman saying', (done) => {
    chai.request(app)
      .get('/api/status')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.status.should.equal('I am batman');

        done();
      });
  });
});
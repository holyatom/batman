import chai from 'chai';
import chaiHttp from 'chai-http';
import bodyParser from 'body-parser';
import server from 'server';
import middlewares from '../../server/middlewares';



let should = chai.should();

describe('API', () => {
  chai.use(chaiHttp);

  var app = server.app;

  app.use(bodyParser.json());
  app.use(middlewares.lang);
  app.use(middlewares.jwt);

  server.initControllers();

  describe('Status', () => {
    it('should return ok message', (done) => {
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
});
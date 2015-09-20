import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import config from 'config';
import bodyParser from 'body-parser';
import middlewares from '../server/middlewares';
import log from 'libs/logger';
import userFactory from 'test/factories/user';


let database = function (cb) {
  mongoose.connect(`mongodb://${config.mongodb.host}/${config.mongodb.database}`);

  mongoose.connection.on('error', (error) => {
    log('error', `mongodb operation failed: ${error}`);
  });

  mongoose.connection.once('open', () => {
    log('info', 'test database was connected');

    mongoose.connection.db.dropDatabase((err) => {
      if (err) {
        log('error', 'mongodb wasn\'t cleared');
      } else {
        log('info', 'mongodb was successfully cleared');
        cb();
      }
    })
  });
};

export function setup (app, ctrl, cb) {
  chai.use(chaiHttp);
  app.use(bodyParser.json());
  app.use(middlewares.lang);
  app.use(middlewares.jwt);
  ctrl.use(app);

  database(() => {
    userFactory.create((err, user) => {
      if (err) {
        cb(err);
      } else {
        ctrl.user = user;
        cb();
      }
    });
  });
};

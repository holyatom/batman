import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import config from 'config';
import bodyParser from 'body-parser';
import middlewares from '../server/middlewares';
import userFactory from 'test/factories/user';
import { contains } from 'libs/utils';


let database = function (cb) {
  if (contains([1, 2], mongoose.connection.readyState)) {
    return cb();
  }

  mongoose.connect(`mongodb://${config.mongodb.host}/${config.mongodb.database}`);

  mongoose.connection.on('error', (error) => {
    console.log(`mongodb operation failed: ${error}`);
  });

  mongoose.connection.once('open', () => {
    mongoose.connection.db.dropDatabase((err) => {
      if (err) {
        console.log('mongodb wasn\'t cleared');
      } else {
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
        console.log(err);
        cb(err);
      } else {
        ctrl.user = user;
        cb();
      }
    });
  });
};

import Controller from '../base/controller';


export default class Api extends Controller {
  status (req, res, next) {
    res.send({ status: 'I am batman' });
  }

  buckwheat (req, res, next) {
    throw new Error('Buckwheat exception!');
  }

  router () {
    this.get('/api/status', this.status);
    this.get('/api/buckwheat', this.buckwheat);
  }
}

Controller.prototype.logPrefix = 'api-controller';

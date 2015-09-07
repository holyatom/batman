import ModelController from '../../base/model_controller';
import User from '../../models/user';


export default class SearchUsers extends ModelController {
  constructor () {
    super();

    this.logPrefix = 'search-users-controller';
    this.urlPrefix = '/search/users';
    this.Model = User;
    this.auth = true;
    this.actions = ['list'];
    this.filterableFields = ['username'];
  }
}

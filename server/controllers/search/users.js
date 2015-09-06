import ModelController from '../../base/model_controller';
import User from '../../models/user';


export default class SearchUsers extends ModelController {

}

SearchUsers.prototype.logPrefix = 'search-users-controller';
SearchUsers.prototype.urlPrefix = '/search';
SearchUsers.prototype.Model = User;
SearchUsers.prototype.auth = true;
SearchUsers.prototype.actions = ['list'];
SearchUsers.prototype.filterableFields = ['username'];

SearchUsers.prototype.list.url = '/users';

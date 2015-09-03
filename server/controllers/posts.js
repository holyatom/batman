import ModelController from '../base/model_controller';
import Post from '../models/post';
import User from '../models/user';


export default class PostsController extends ModelController {
}

PostsController.prototype.logPrefix = 'posts-controller';
PostsController.prototype.urlPrefix = '/user/:username*?/posts';
PostsController.prototype.Model = Post;

PostsController.prototype.sortableFields = [];
PostsController.prototype.actions = [];

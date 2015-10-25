import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import v from 'libs/validators';


let schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: v.required(),
    validate: [v.badUsername(), v.maxLength(12), v.minLength(4), v.alphanumeric()],
  },
  password: {
    type: String,
    required: v.required(),
    validate: [v.maxLength(20), v.minLength(6), v.alphanumeric()],
  },
  created: {
    type: Date,
    required: v.required(),
  },
  full_name: {
    type: String,
  },
  image_url: {
    type: String,
    default: '/images/default_avatar.jpg',
  },
});

schema.pre('save', function (next) {
  if (!this.isModified('password') && !this.isNew) {
    return next();
  }

  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

schema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

schema.methods.toJSON = function () {
  let json = this.toObject();
  delete json.password;

  return json;
};

export default mongoose.model('User', schema);

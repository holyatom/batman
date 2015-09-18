import mongoose from 'mongoose';
import v from 'libs/validators';


var schema = new mongoose.Schema({
  follower_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: v.required()
  },
  followee_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: v.required()
  },
  started: {
    type: Date,
    required: v.required()
  },
  ended: {
    type: Date
  }
});

export default mongoose.model('Following', schema);

import mongoose from 'mongoose';
import v from 'libs/validators';


var schema = new mongoose.Schema({
  description: {
    type: String,
    required: v.required()
  },
  date: {
    type: Date,
    required: v.required()
  },
  image_url: {
    type: String
  },
  address: {
    type: String,
    required: v.required()
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: v.required()
  },
  created: {
    type: Date,
    required: v.required()
  }
});

export default mongoose.model('Event', schema);
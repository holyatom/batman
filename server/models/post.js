import mongoose from 'mongoose';
import v from 'libs/validators';


var schema = new mongoose.Schema({
  description: {
    type: String,
    required: v.required()
  },
  address: {
    type: String,
    required: v.required()
  },
  image_urls: {
    type: [String]
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: v.required()
  },
  created: {
    type: Date,
    required: v.required()
  },
  location_name: {
    type: String,
    required: v.required()
  },
});

export default mongoose.model('Post', schema);

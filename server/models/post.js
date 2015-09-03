import mongoose from 'mongoose';


var schema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  created: {
    type: Date,
    required: true
  }
});

export default mongoose.model('Post', schema);

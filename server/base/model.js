import mongoose from 'mongoose';


class Model {
  constructor (name) {
    return new mongoose.model(name, schema);
  }
}

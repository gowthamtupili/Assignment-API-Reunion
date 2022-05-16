const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  UserName: String,
  Email: String,
  Password: String,
  Followers: Number,
  Following: [],
  Posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
})


module.exports = mongoose.model('User', UserSchema);
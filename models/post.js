const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comment");

const PostSchema = new Schema({
  title: String,
  desc: String,
  created_at: Date,
  likes: [],
  no_of_likes: Number,
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

PostSchema.post("findOneAndDelete", async function (post) {
  if (post.comments.length) {
    const res = await Review.deleteMany({ _id: { $in: post.comments } });
    console.log(res);
  }
});

module.exports = mongoose.model("Post", PostSchema);

const Post = require("../models/post");
const Comment = require("../models/comment");
const jwt = require('jsonwebtoken');


module.exports.createComment = async (req, res) => {
  console.log(`hi ;;;;;;`);
  console.log(req.params);
  try {
    const { comment } = req.body;
    const foundPost = await Post.findById(req.params.id);
    const newComment = await new Comment({
      Comment: `${comment}`,
    });
    console.log(foundPost);
    await newComment.save();
    foundPost.comments.push(newComment);
    await foundPost.save();
    console.log(newComment._id);
    const d = newComment._id;
    res.json(d);
  } catch (e) {
    res.json(e);
  }
};

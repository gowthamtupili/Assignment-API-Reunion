const User = require("../models/user");
const Post = require("../models/post");
const jwt = require('jsonwebtoken');

const users = require('./users');



module.exports.showPost = async (req, res) => {
  try {
    const { id } = req.params;
    const foundPost = await Post.findById(id).populate("comments");
    const data = {
      post_ID: `${foundPost._id}`,
      no_of_likes: `${foundPost.likes.length}`,
      comments: `${foundPost.comments}`,
    };
    res.json(data);
  } catch (e) {
    res.json(e);
  }
};



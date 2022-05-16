const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isValidJWT } = require("../middleware");

const User = require("../models/user");
const Post = require("../models/post");

const posts = require("../controllers/posts");
const users = require('../controllers/users');



router.post('/', isValidJWT, users.createPost);

router.route('/:id')
  .get(isValidJWT, posts.showPost)
  .delete(isValidJWT, users.deletePost);

module.exports = router;
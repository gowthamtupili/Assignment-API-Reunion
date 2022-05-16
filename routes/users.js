const express = require("express");
const router = express.Router();
const { isValidJWT } = require("../middleware");
const jwt = require('jsonwebtoken');

const User = require("../models/user");
const Post = require("../models/post");

const users = require("../controllers/users");

router.post("/authenticate", users.authenticate);

router.get("/user", isValidJWT, users.showUserInfo);

router.get("/all_posts", isValidJWT, users.userAllPosts);

router.post("/follow/:id", isValidJWT, users.followUser);

router.post("/unfollow/:id", isValidJWT, users.unFollowUser);

router.post("/like/:id", isValidJWT, users.likePost);

router.post("/unlike/:id", isValidJWT, users.unLikePost);


module.exports = router;
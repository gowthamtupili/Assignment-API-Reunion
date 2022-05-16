const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isValidJWT } = require("../middleware");


const Post = require("../models/post");
const Comment = require("../models/comment");

const comments = require('../controllers/comments');


router.post("/:id", isValidJWT, comments.createComment );

module.exports = router;
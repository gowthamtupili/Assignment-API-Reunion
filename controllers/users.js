const User = require("../models/user");
const Post = require("../models/post");
const jwt = require("jsonwebtoken");


const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const secret = process.env.TOKEN_SECRET || "Thisisasecret";

module.exports.authenticate = async (req, res) => {
  const foundUser = await User.findOne({ Email: req.body.Email });
  try {
    const match = req.body.Password === foundUser.Password ? 1 : 0;
    const accessToken = jwt.sign(req.body, secret);
    if (match) {
      app.locals.authUserID = foundUser._id;
      const authValue = "Bearer" + " " + `${accessToken}`;
      // res.headers.set('authorization', authValue);
      res.json({ accessToken });
    } else {
      res.json({ message: "Invalid Credentials" });
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports.followUser = async (req, res) => {
  // console.log(app.locals.authUserID);
  const authUser = await User.findById(app.locals.authUserID);
  // console.log(authUser);
  const { id } = req.params;

  // To check if req.params.id is valid id for User.
  try {
    const foundUser = await User.findById(id);
  } catch (error) {
    return res.send(`Invalid User ID`);
  }

  if (app.locals.authUserID === id) {
    return res.json(`Given ID is the ID of current user`);
  }

  const isFollower = authUser.Following.includes(id);
  if (!isFollower) {
    authUser.Following.push(`${id}`);
    await authUser.save();
    const foundUser = await User.findById(id);
    const num = foundUser.Followers;
    foundUser.Followers = num + 1;
    await foundUser.save();
    // console.log(authUser);
  } else {
    return res.json("The User is already following");
  }
  res.json(`User Started following user with id: ${id}`);
};

module.exports.unFollowUser = async (req, res) => {
  const authUser = await User.findById(app.locals.authUserID);
  const { id } = req.params;
  // To check if req.params.id is valid id for User.
  try {
    const foundUser = await User.findById(id);
  } catch (error) {
    return res.send(`Invalid User ID`);
  }
  const isFollower = authUser.Following.includes(id);
  if (!isFollower) {
    return res.json(`The current user is not following the user with ${id}`);
  } else {
    authUser.Following = authUser.Following.filter(
      (id1) => id1 !== id.toString()
    );
    const foundUser = await User.findById(id);
    const num = foundUser.Followers;
    foundUser.Followers = num - 1;
    await authUser.save();
    // console.log(authUser);
  }
  res.json(`User Unfollowed user with id: ${id}`);
  // Remove id from authUser followers array.
};

module.exports.showUserInfo = async (req, res) => {
  const authUser = await User.findById(app.locals.authUserID);
  const data = {
    User_Name: `${authUser.UserName}`,
    no_of_followers: `${authUser.Followers}`,
    no_of_following: `${authUser.Following.length}`,
  };
  res.json(data);
};

module.exports.userAllPosts = async (req, res) => {
  try {
    const foundUser = await User.findById(app.locals.authUserID).populate(
      "Posts"
    );
    res.json(foundUser);
  } catch (e) {
    res.json(`error`);
  }
};

module.exports.likePost = async (req, res) => {
  const { id } = req.params;
  try {
    const foundPost = await Post.findById(id);
    const isLiked = foundPost.likes.includes(app.locals.authUserID);
    if (!isLiked) {
      foundPost.likes.push(`${app.locals.authUserID}`);
      foundPost.no_of_likes = foundPost.likes.length;
      await foundPost.save();
      console.log(foundPost);
    } else {
      return res.json("User already liked the Post");
    }
    res.json(`User liked the post with post_id: ${id}`);
  } catch (e) {
    return res.json("Invalid Post ID");
  }
};

module.exports.unLikePost = async (req, res) => {
  const { id } = req.params;
  try {
    const foundPost = await Post.findById(id);
    const isLiked = foundPost.likes.includes(app.locals.authUserID);
    if (!isLiked) {
      return res.json(`The current user didn't like the post with id ${id}`);
    } else {
      foundPost.likes = foundPost.likes.filter(
        (id1) => id1 !== app.locals.authUserID.toString()
      );
      foundPost.no_of_likes = foundPost.likes.length;
      await foundPost.save();
      console.log(foundPost);
    }
    res.json(`User unliked post with id: ${id}`);
  } catch (e) {
    return res.json("Invalid Post ID");
  }
};

module.exports.createPost = async (req, res) => {
  try {
    console.log(`app.local:`);
    console.log(app.locals.authUserID);
    const authUser = await User.findById(app.locals.authUserID);
    const date = new Date();
    const { title, desc } = req.body;
    const newPost = await new Post({
      title,
      desc,
      created_at: `${date}`,
    });
    await newPost.save();
    authUser.Posts.push(newPost);
    await authUser.save();

    const data = {
      Post_ID: `${newPost._id}`,
      Title: `${newPost.title}`,
      Description: `${newPost.desc}`,
      Create_Time: `${newPost.created_at}`,
    };
    res.json(data);
  } catch (err) {
    res.status(statusCode).json(err);
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(app.locals.authUserID, {
      $pull: { Posts: id },
    });
    await Post.findByIdAndDelete(id);
    res.json(`Deleted!`);
  } catch (err) {
    res.status(statusCode).json(err);
  }
};

const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

mongoose
  // .connect("mongodb://localhost:27017/api-reunion")
  .connect('mongodb+srv://GowthamTupili:mJsj2aXyvyy11TLp@api-reunion-cluster.ecwdz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connection OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR!");
    console.log(err);
  });

const seedDB = async () => {
  // await User.deleteMany({});
  // await Comment.deleteMany({});
  // await Post.deleteMany({});

  for (let i = 1; i <6 ; i++) {
    const newUser = new User({
      UserName: `User${i}`,
      Email: `User${i}@gmail.com`,
      Password: `User${i}`,
    });

    await newUser.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});

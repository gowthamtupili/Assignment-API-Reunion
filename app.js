if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const ExpressError = require("./utils/ExpressError");
const { isValidJWT } = require("./middleware");
const secret = process.env.TOKEN_SECRET || "Thisisasecret";


const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");

const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/api-reunion";

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Database Connected!!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR!");
    console.log(err);
  });


app.get('/', (req, res) => {
  res.json('Home Page for Backend Assignment for Reunion');
})

app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comment/", commentRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = `Oh no, Something went wrong!`;
  res.status(statusCode).json(err.message);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

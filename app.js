require("dotenv").config();

const express = require("express");

const path = require("path");

const { checkForAuthenticationCookie } = require("./middleware/authentication");

const userRouter = require("./routes/user");

const blogRoute = require("./routes/blog");

const Blog = require("./models/blog");

const app = express();

const mongoose = require("mongoose");

const PORT = process.env.PORT || 8000;

const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");

app.set("views", path.join("views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongoDB connected"));
app.use("/user", userRouter);
app.use("/blog", blogRoute);

app.get("/", async(req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home" , {
    user : req.user,
    blogs : allBlogs,
  });
});

app.listen(PORT, () => console.log(`SERVER STARTED AT PORT ${PORT}`));
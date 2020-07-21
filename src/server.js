const express = require("express");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");
const { ObjectId, Schema } = require("mongoose");
mongoose.connect("mongodb://localhost:27017/microblog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cookies = require("cookie-parser");
app.use(cookies());

const jwt = require("jsonwebtoken");
const jwtSecret = "ebin :D:D:D";

async function generateToken(user) {
  return await jwt.sign(
    {
      sub: user._id,
    },
    jwtSecret,
    {
      expiresIn: 24 * 60 * 60,
    }
  );
}

const Post = new mongoose.model(
  "Post",
  new Schema({
    text: String,
    time: Date,
    author: ObjectId,
  })
);

const User = new mongoose.model(
  "User",
  new Schema({
    handle: String,
  })
);

app.get("/ping", (req, res) => {
  res.json({ pong: "pong" });
});

app.get("/feed", async (req, res) => {
  res.json(await Post.find({}));
});

app.post("/feed", async (req, res) => {
  try {
    await Post.create({ ...req.body, time: new Date() });
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
  return res.sendStatus(200);
});

app.delete("/post/:id", async (req, res) => {
  try {
    console.log(req.params);
    await Post.findByIdAndDelete(req.params.id);
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
  return res.sendStatus(200);
});

app.post("/register", async (req, res) => {
  const { handle } = req.body;
  if (await User.exists({ handle })) {
    return res.sendStatus(400);
  }

  try {
    await User.create({ handle });
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
  return res.sendStatus(200);
});

app.post("/login", async (req, res) => {
  const { handle } = req.body;
  const user = await User.findOne({ handle });
  if (!user) {
    return res.sendStatus(400);
  }

  const token = await generateToken(user);
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.sendStatus(200);
});

app.listen(8080);

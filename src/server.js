const express = require("express");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");
const { ObjectId, Schema } = require("mongoose");
mongoose.connect("mongodb://localhost:27017/microblog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Post = new mongoose.model(
  "Post",
  new Schema({
    text: String,
    time: Date,
    author: ObjectId,
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
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.delete("/post/:id", async (req, res) => {
  try {
    console.log(req.params);
    await Post.findByIdAndDelete(req.params.id);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});
app.listen(8080);

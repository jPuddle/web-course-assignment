const express = require("express");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const path = require("path");

// Reading env variables (config example from https://github.com/sclorg/nodejs-ex/blob/master/server.js)
// In local dev environment, you need to export MONGO_URL=mongodb://localhost:27017/microblog or similar
var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;

if (mongoURL == null) {
  var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
  // If using plane old env vars via service discovery
  if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    mongoHost = process.env[mongoServiceName + "_SERVICE_HOST"];
    mongoPort = process.env[mongoServiceName + "_SERVICE_PORT"];
    mongoDatabase = process.env[mongoServiceName + "_DATABASE"];
    mongoPassword = process.env[mongoServiceName + "_PASSWORD"];
    mongoUser = process.env[mongoServiceName + "_USER"];

    // If using env vars from secret from service binding
  } else if (process.env.database_name) {
    mongoDatabase = process.env.database_name;
    mongoPassword = process.env.password;
    mongoUser = process.env.username;
    var mongoUriParts = process.env.uri && process.env.uri.split("//");
    if (mongoUriParts.length === 2) {
      mongoUriParts = mongoUriParts[1].split(":");
      if (mongoUriParts && mongoUriParts.length === 2) {
        mongoHost = mongoUriParts[0];
        mongoPort = mongoUriParts[1];
      }
    }
  }

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURL = "mongodb://";
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ":" + mongoPassword + "@";
    }
    // Provide UI label that excludes user id and pw
    mongoURL += mongoHost + ":" + mongoPort + "/" + mongoDatabase;
  }
}

// Connecting to DB
mongoose.connect(mongoURL);
mongoose.Promise = Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const cookies = require("cookie-parser");
app.use(cookies());

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "ebin :D:D:D";

const Post = new mongoose.model(
  "Post",
  new Schema({
    text: { type: String, minlength: 1, maxlength: 512, trim: true },
    time: Date,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  })
);

const User = new mongoose.model(
  "User",
  new Schema({
    handle: {
      type: String,
      trim: true,
      match: /^[a-z0-9][a-z0-9_-]*$/,
      minlength: 1,
      maxlength: 16,
      lowercase: true,
    },
    password: { type: String, select: false },
  })
);

async function generateToken(user) {
  return await jwt.sign(
    {
      sub: user._id,
      handle: user.handle,
    },
    jwtSecret,
    {
      expiresIn: 24 * 60 * 60,
    }
  );
}

const authenticated = express.Router();
authenticated.use(async (req, res, next) => {
  const token = req.cookies["token"];
  if (!token) {
    return res.status(401).json({ message: "Cookie authentication failed." });
  }
  try {
    const decoded = await jwt.verify(token, jwtSecret);
    req.userId = decoded.sub;
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Cookie authentication failed." });
  }
  return next();
});

const api = express.Router();

api.get("/feed/:id", async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });

  res.json(await Post.find({ author: user._id }).populate("author"));
});

api.get("/feed", async (req, res) => {
  res.json(await Post.find({}).populate("author"));
});

authenticated.post("/feed", async (req, res) => {
  try {
    await Post.create({ ...req.body, time: new Date(), author: req.userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error saving post." });
  }
  return res.sendStatus(200);
});

authenticated.delete("/post/:id", async (req, res) => {
  try {
    if (
      (await Post.deleteOne({ _id: req.params.id, author: req.userId }))
        .deletedCount < 1
    ) {
      return res.status(400).json({
        message: "Could not delete post. (No such post or not authorized)",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting post." });
  }
  return res.sendStatus(200);
});

api.post("/register", async (req, res) => {
  const { handle, password } = req.body;
  if (await User.exists({ handle })) {
    return res.status(400).json({ message: "Username is taken." });
  }

  const hash = await bcrypt.hash(password, saltRounds);
  try {
    await User.create({ handle, password: hash });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating user." });
  }
  return res.sendStatus(200);
});

api.post("/login", async (req, res) => {
  const { handle, password } = req.body;
  const user = await User.findOne({ handle }).select("+password");
  if (!user) {
    return res.status(400).json({ message: "User does not exist." });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(400).json({ message: "Incorrect password." });
  }

  const token = await generateToken(user);
  const args = [
    "token",
    token,
    {
      maxAge: 24 * 60 * 60 * 1000,
    },
  ];
  res.cookie(...args);

  return res.json(args);
});

app.use(express.static("build"));

app.use("/api/auth", authenticated);
app.use("/api", api);

app.use((req, res) => {
  res.sendFile("/index.html", { root: path.join(__dirname, "../build") });
});

app.listen(8080);

const express = require("express");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// Reading env variables (config example from https://github.com/sclorg/nodejs-ex/blob/master/server.js)
var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
  mongoURLLabel = "";

// For local dev
// var mongoURL = 'mongodb://localhost:27017/demodb';

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
    mongoURLLabel = mongoURL = "mongodb://";
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ":" + mongoPassword + "@";
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ":" + mongoPort + "/" + mongoDatabase;
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
const jwtSecret = "ebin :D:D:D";

const Post = new mongoose.model(
  "Post",
  new Schema({
    text: String,
    time: Date,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  })
);

const User = new mongoose.model(
  "User",
  new Schema({
    handle: String,
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
    console.debug("no cookie");
    return res.sendStatus(400);
  }
  try {
    const decoded = await jwt.verify(token, jwtSecret);
    req.userId = decoded.sub;
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
  return next();
});

app.get("/ping", (req, res) => {
  res.json({ pong: "pong" });
});

app.get("/feed/:id", async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });

  res.json(await Post.find({ author: user._id }).populate("author"));
});

app.get("/feed", async (req, res) => {
  res.json(await Post.find({}).populate("author"));
});

authenticated.post("/feed", async (req, res) => {
  try {
    await Post.create({ ...req.body, time: new Date(), author: req.userId });
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
  return res.sendStatus(200);
});

authenticated.delete("/post/:id", async (req, res) => {
  try {
    if (
      (await Post.deleteOne({ _id: req.params.id, author: req.userId }))
        .deletedCount < 1
    ) {
      return res.sendStatus(400);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
  return res.sendStatus(200);
});

app.post("/register", async (req, res) => {
  const { handle, password } = req.body;
  if (await User.exists({ handle })) {
    return res.sendStatus(400);
  }

  const hash = await bcrypt.hash(password, saltRounds);
  try {
    await User.create({ handle, password: hash });
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
  return res.sendStatus(200);
});

app.post("/login", async (req, res) => {
  const { handle, password } = req.body;
  const user = await User.findOne({ handle }).select("+password");
  if (!user) {
    return res.sendStatus(400);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.sendStatus(400);
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

app.use(authenticated);

app.listen(8080);

import { createSlice, nanoid } from "@reduxjs/toolkit";
import _ from "lodash";
import axios from "axios";
import store from "../../store.js";

const initialState = [
  {
    author: { handle: "spurdoman" },
    time: new Date().toISOString(),
    text: "benis :D:D:D",
    _id: nanoid(),
  },
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    pongReceived(state, action) {
      console.log({ state, action });
      state.push({
        author: { handle: "server" },
        time: new Date().toISOString(),
        text: action.payload.pong,
        _id: nanoid(),
      });
    },
    feedReceived(state, action) {
      return action.payload;
    },
    refreshFeed(state, action) {
      axios
        .get("/feed")
        .then((response) => store.dispatch(feedReceived(response.data)));
    },
    createSpam(state, action) {
      axios
        .get("/ping")
        .then((response) => store.dispatch(pongReceived(response.data)));
    },
    createPost(state, action) {
      axios
        .post("/feed", action.payload)
        .then((response) => store.dispatch(refreshFeed()));
    },
    deletePost(state, action) {
      _.remove(state, (post) => post.id === action.payload);
    },
  },
});

export const {
  pongReceived,
  feedReceived,
  refreshFeed,
  createSpam,
  createPost,
  deletePost,
} = postsSlice.actions;
export default postsSlice.reducer;

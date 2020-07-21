import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import store from "../../store.js";

const initialState = [];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    feedReceived(state, action) {
      return action.payload;
    },
    refreshFeed(state, action) {
      axios
        .get("/feed")
        .then((response) => store.dispatch(feedReceived(response.data)));
    },
    createPost(state, action) {
      axios
        .post("/feed", action.payload)
        .then((response) => store.dispatch(refreshFeed()));
    },
    deletePost(state, action) {
      axios
        .delete(`/post/${action.payload}`)
        .then((response) => store.dispatch(refreshFeed()));
    },
  },
});

export const {
  feedReceived,
  refreshFeed,
  createPost,
  deletePost,
} = postsSlice.actions;
export default postsSlice.reducer;

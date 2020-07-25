import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import store from "../../store.js";
import { globalCookies } from "../../App";

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
    login(state, action) {
      axios.post("/login", action.payload).then((response) => {
        globalCookies.set(...response.data);
      });
    },
    register(state, action) {
      axios.post("/register", action.payload);
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
  login,
  register,
} = postsSlice.actions;
export default postsSlice.reducer;

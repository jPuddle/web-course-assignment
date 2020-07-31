import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import store from "../store.js";
import { createNotification } from "./notificationsSlice";

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
        .get("/api/feed")
        .then((response) => store.dispatch(feedReceived(response.data)))
        .catch((reason) =>
          store.dispatch(createNotification(reason.response.data))
        );
    },
    createPost(state, action) {
      axios
        .post("/api/auth/feed", action.payload)
        .then((response) => store.dispatch(refreshFeed()))
        .catch((reason) =>
          store.dispatch(createNotification(reason.response.data))
        );
    },
    deletePost(state, action) {
      axios
        .delete("/api/auth/post/" + action.payload)
        .then((response) => store.dispatch(refreshFeed()))
        .catch((reason) =>
          store.dispatch(createNotification(reason.response.data))
        );
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

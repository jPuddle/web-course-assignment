import { configureStore } from "@reduxjs/toolkit";

import postsReducer from "./slices/posts/postsSlice";

export default configureStore({
  reducer: {
    posts: postsReducer
  }
});

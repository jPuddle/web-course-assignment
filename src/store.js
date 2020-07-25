import { configureStore } from "@reduxjs/toolkit";

import postsReducer from "./slices/posts/postsSlice";
import userReducer from "./slices/posts/userSlice";

export default configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
  },
});

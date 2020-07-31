import { configureStore } from "@reduxjs/toolkit";

import postsReducer from "./slices/postsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import userReducer from "./slices/userSlice";

export default configureStore({
  reducer: {
    notifications: notificationsReducer,
    posts: postsReducer,
    user: userReducer,
  },
});

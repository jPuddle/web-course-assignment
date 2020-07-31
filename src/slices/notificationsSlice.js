import { createSlice, nanoid } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = [];

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    createNotification(state, action) {
      state.push({ ...action.payload, id: nanoid() });
      return state;
    },
    deleteNotification(state, action) {
      _.remove(state, (noti) => {
        return noti.id === action.payload;
      });
      return state;
    },
  },
});

export const {
  createNotification,
  deleteNotification,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;

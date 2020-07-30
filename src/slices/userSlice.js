import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { cookies } from "../App";
import store from "../store.js";

const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    init(state, action) {
      const token = cookies.get("token");
      if (!token) return null;
      else return jwt_decode(token);
    },
    login(state, action) {
      console.log(action.payload);
      axios.post("/api/login", action.payload).then((response) => {
        store.dispatch(loginSuccess(response.data));
      });
      return state;
    },
    loginSuccess(state, action) {
      cookies.set(...action.payload);
      return jwt_decode(action.payload[1]);
    },
    logout(state, action) {
      cookies.remove("token");
      return null;
    },
    register(state, action) {
      axios.post("/api/register", action.payload).then((response) => {
        window.location = "/";
      });
      return state;
    },
  },
});

export const {
  init,
  login,
  loginSuccess,
  logout,
  register,
} = userSlice.actions;
export default userSlice.reducer;

import React, { useEffect } from "react";
import "./App.scss";
import { Provider } from "react-redux";
import store from "./store.js";
import Feed from "./Feed";
import PostComposer from "./PostComposer";
import Login from "./Login";
import Axios from "axios";
import { feedReceived } from "./slices/posts/postsSlice";
import Register from "./Register";
import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { CookiesProvider, useCookies, Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";

export const globalCookies = new Cookies();

function App() {
  useEffect(() => {
    Axios.get("/feed").then((response) =>
      store.dispatch(feedReceived(response.data))
    );
  }, []);

  const [cookies, , removeCookie] = useCookies(["token"]);
  const decoded = cookies.token ? jwt_decode(cookies.token) : null;
  return (
    <div className="App">
      <div className="container">
        <div className="column navigation">
          {cookies.token ? (
            <>
              <p> Logged in as {decoded.handle} </p>
              <button
                className="logout"
                onClick={() => {
                  removeCookie("token");
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/">
                <Link to="/login">Log in</Link>
                <Link to="/register">Sign up</Link>
              </Route>
            </Switch>
          )}
        </div>
        <div className="column content">
          <PostComposer />
          <Feed />
        </div>
        <div className="column search">Search</div>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <CookiesProvider cookies={globalCookies}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </CookiesProvider>
  );
}

export default AppWrapper;

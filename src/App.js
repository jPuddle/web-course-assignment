import React, { useEffect } from "react";
import "./App.scss";
import { Provider } from "react-redux";
import store from "./store.js";
import Feed from "./Feed";
import PostComposer from "./PostComposer";
import Login from "./Login";
import Axios from "axios";
import { feedReceived } from "./slices/posts/postsSlice";
import { init, logout } from "./slices/posts/userSlice";
import Register from "./Register";
import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { CookiesProvider, Cookies } from "react-cookie";
import { useSelector } from "react-redux";

export const globalCookies = new Cookies();

function App() {
  useEffect(() => {
    store.dispatch(init());
    Axios.get("/feed").then((response) =>
      store.dispatch(feedReceived(response.data))
    );
  }, []);

  const decoded = useSelector((state) => state.user);
  const loggedIn = !!decoded;
  return (
    <div className="App">
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route>
          <div className="container">
            <div className="column navigation">
              {loggedIn ? (
                <>
                  <p> Logged in as {decoded.handle} </p>
                  <button
                    className="logout"
                    onClick={() => {
                      store.dispatch(logout());
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Login />
                  <Link to="/register">Sign up</Link>
                </>
              )}
            </div>
            <div className="column content">
              {loggedIn && <PostComposer />}
              <Feed />
            </div>
            <div className="column search">Search</div>
          </div>
        </Route>
      </Switch>
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

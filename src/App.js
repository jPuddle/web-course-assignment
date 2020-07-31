import React, { useEffect } from "react";
import "./App.scss";
import { Provider } from "react-redux";
import store from "./store.js";
import Feed from "./Feed";
import PostComposer from "./PostComposer";
import Login from "./Login";
import Notifications from "./Notifications";
import { init, logout } from "./slices/userSlice";
import Register from "./Register";
import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { CookiesProvider, Cookies } from "react-cookie";
import { useSelector } from "react-redux";
import { refreshFeed } from "./slices/postsSlice";

export const cookies = new Cookies();

function App() {
  useEffect(() => {
    store.dispatch(init());
    store.dispatch(refreshFeed());
  }, []);

  const decoded = useSelector((state) => state.user);
  const loggedIn = !!decoded;
  return (
    <div className="App">
      <Notifications />
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
                  <Link to="/register">
                    <button>Sign up</button>
                  </Link>
                </>
              )}
            </div>
            <div className="column content">
              {loggedIn && <PostComposer />}
              <Feed />
            </div>
            <div className="column filler" />
          </div>
        </Route>
      </Switch>
    </div>
  );
}

function AppWrapper() {
  return (
    <CookiesProvider cookies={cookies}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </CookiesProvider>
  );
}

export default AppWrapper;

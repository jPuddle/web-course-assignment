import React, { useEffect } from "react";
import "./App.scss";
import { Provider } from "react-redux";
import store from "./store.js";
import Feed from "./Feed";
import PostComposer from "./PostComposer";
import Axios from "axios";
import { feedReceived } from "./slices/posts/postsSlice";

function App() {
  const posts = [];

  useEffect(() => {
    Axios.get("/feed").then((response) =>
      store.dispatch(feedReceived(response.data))
    );
  }, []);

  return (
    <Provider store={store}>
      <div className="App">
        <div className="container">
          <div className="column navigation">Navigation</div>
          <div className="column content">
            <PostComposer />
            <Feed posts={posts} />
          </div>
          <div className="column search">Search</div>
        </div>
      </div>
    </Provider>
  );
}

export default App;

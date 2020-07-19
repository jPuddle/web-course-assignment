import React from "react";
import "./App.scss";
import { Provider } from "react-redux";
import store from "./store.js";
import Feed from "./Feed";

function App() {
  const posts = [];

  return (
    <Provider store={store}>
      <div className="App">
        <div className="container">
          <div className="column navigation">Navigation</div>
          <div className="column content">
            <Feed posts={posts} />
          </div>
          <div className="column search">Search</div>
        </div>
      </div>
    </Provider>
  );
}

export default App;

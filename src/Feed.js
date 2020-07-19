import React from "react";
import Post from "./Post";
import _ from "lodash";
import { useSelector } from "react-redux";
import "./Feed.scss";

function Feed() {
  const posts = useSelector((state) => state.posts);
  return (
    <div className="Feed">
      {posts.map((post) => (
        <Post {..._.pick(post, ["author", "time", "text"])} key={post.id} />
      ))}
    </div>
  );
}

export default Feed;

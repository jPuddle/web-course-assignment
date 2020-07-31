import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./Register.scss";
import { register } from "./slices/userSlice";
import { Link } from "react-router-dom";

function Register() {
  const dispatch = useDispatch();
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="Register">
      <div className="container">
        Handle:
        <input
          className="handle"
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        <br />
        Password:
        <input
          className="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button
          className="registerbutton"
          onClick={() =>
            dispatch(
              register({
                handle,
                password,
              })
            )
          }
        >
          Register
        </button>
      </div>
      <p>
        Handle must be 1-16 characters long.
        <br />
        Handle may contain letters (a-z, case-insensitive), numbers (0-9),
        underscores (_) and dashes (-).
        <br />
        Handle must start with a letter.
      </p>
      <Link to="/">
        <button>Go back</button>
      </Link>
    </div>
  );
}

export default Register;

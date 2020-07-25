import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./Register.scss";
import { register } from "./slices/posts/postsSlice";

function Register() {
  const dispatch = useDispatch();
  const [handle, setHandle] = useState("");
  return (
    <div className="Register">
      <input
        className="handlebox"
        type="text"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />
      <div className="buttons">
        <button
          className="registerbutton"
          onClick={() =>
            dispatch(
              register({
                handle,
              })
            )
          }
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;

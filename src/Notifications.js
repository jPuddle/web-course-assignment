import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Notifications.scss";
import { deleteNotification } from "./slices/notificationsSlice";

function Notifications({ text, image, author, time, _id }) {
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  return (
    <div className="Notifications">
      {notifications.map((notification) => (
        <div className="notification" key={notification.id}>
          {notification.message}
          <button onClick={() => dispatch(deleteNotification(notification.id))}>
            X
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notifications;

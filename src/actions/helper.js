import axios from "../utils/axios";
import {
  AUTH_USER,
  USERS,
  CONVERSATIONS,
  APP_DATA_LOADING,
  PROFILE_DATA,
} from "./types";
import history from "../utils/history";
import {
  login,
  changePassword,
  conversations,
  updateProfile,
} from "../utils/Routes";

export const saveToken = (token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("exp", Date.now() + 30 * 24 * 60 * 60 * 1000);
};

export const loadDataHelper = async (
  dispatch,
  token,
  cons,
  users,
  user,
  me
) => {
  dispatch({
    type: APP_DATA_LOADING,
    payload: "loading",
  });

  try {
    if (me) {
      const me = await axios.get("/api/v1/users/me", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: AUTH_USER,
        payload: {
          user: me.data.user,
        },
      });

      user = me.data.user;
    }

    dispatch({
      type: PROFILE_DATA,
      payload: {
        username: user.username,
        email: user.email,
      },
    });

    if (users) {
      const users = await axios.get("/api/v1/users", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: USERS,
        payload: [...users.data.users],
      });
    }

    if (cons) {
      const conversations = await axios.get("/api/v1/conversations", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      let count = 0;
      conversations.data.conversations.forEach((con) => {
        const lastMsg = con.messages[con.messages.length - 1];

        if (!lastMsg || lastMsg.user !== user._id) {
          count++;
        }
      });

      dispatch({
        type: CONVERSATIONS,
        payload: {
          data: conversations.data.conversations,
          notifications: count,
        },
      });
    }

    dispatch({
      type: APP_DATA_LOADING,
      payload: "loaded",
    });
  } catch (err) {
    dispatch({
      type: APP_DATA_LOADING,
      payload: "failed",
    });
    console.log(err);

    const path = window.location.href.split("#")[1];
    switch (path) {
      case conversations:
      case updateProfile:
      case changePassword:
        history.push(login);
        break;
      default:
        return;
    }
  }
};

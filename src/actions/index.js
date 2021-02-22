import {
  NEW_USER_DATA,
  newUserDataState,
  AUTH_USER,
  LOGIN_USER_DATA,
  FORGOT_PASSWORD,
  RESET_PASSWORD_DATA,
  CONVERSATIONS,
  USERS,
  ACTIVE_CONVERSATION,
  MESSAGE_DATA,
} from "./types";
import axios from "../utils/axios";
import history from "../utils/history";
import { emailConfirmation, conversations, login } from "../utils/Routes";
import EMOJIS from "../utils/emojis";

export const setNewUserData = (
  newUser,
  username,
  email,
  password,
  confirmPassword,
  state
) => {
  if (newUser) {
    return {
      type: NEW_USER_DATA,
      payload: {
        username,
        email,
        password,
        confirmPassword,
        state,
      },
    };
  } else {
    return {
      type: NEW_USER_DATA,
      payload: null,
    };
  }
};

export const signupUser = () => async (dispatch, getState) => {
  const { newUserData } = getState();
  newUserData.joinedAt = Date.now();

  try {
    await axios.post("/api/v1/users/signup", newUserData);
    dispatch({
      type: NEW_USER_DATA,
      payload: {
        ...newUserData,
        state: newUserDataState.submitted,
      },
    });
    history.push(emailConfirmation);
  } catch (err) {
    dispatch({
      type: NEW_USER_DATA,
      payload: {
        ...newUserData,
        state: newUserDataState.failed,
      },
    });
  }
};

export const resendAccountActivateEmail = () => async (dispatch, getState) => {
  const { newUserData } = getState();

  dispatch({
    type: NEW_USER_DATA,
    payload: {
      ...newUserData,
      state: newUserDataState.resubmitting,
    },
  });

  try {
    await axios.post("/api/v1/users/resendActivationLink", {
      email: newUserData.email,
    });
    dispatch({
      type: NEW_USER_DATA,
      payload: {
        ...newUserData,
        state: newUserDataState.submitted,
      },
    });
    history.push(emailConfirmation);
  } catch (err) {
    dispatch({
      type: NEW_USER_DATA,
      payload: {
        ...newUserData,
        state: newUserDataState.emailNotExist,
      },
    });
  }
};

export const activateAccount = (token) => async (dispatch) => {
  dispatch({
    type: NEW_USER_DATA,
    payload: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      state: newUserDataState.activatingAccount,
    },
  });
  try {
    const user = await axios.get(`/api/v1/users/activateAccount/${token}`);

    dispatch({
      type: AUTH_USER,
      payload: {
        token: user.data.token,
        user: user.data.user,
      },
    });

    dispatch({
      type: NEW_USER_DATA,
      payload: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        state: newUserDataState.accountActivated,
      },
    });
    history.push(conversations);
  } catch (err) {
    dispatch({
      type: NEW_USER_DATA,
      payload: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        state: newUserDataState.invalidToken,
      },
    });
  }
};

export const setLoginData = (mount, email, password) => {
  if (mount) {
    return {
      type: LOGIN_USER_DATA,
      payload: {
        email,
        password,
      },
    };
  } else {
    return {
      type: LOGIN_USER_DATA,
      payload: null,
    };
  }
};

export const loginUser = () => async (dispatch, getState) => {
  const { loginUserData } = getState();

  dispatch({
    type: LOGIN_USER_DATA,
    payload: {
      ...loginUserData,
      state: "submitting",
    },
  });

  try {
    const user = await axios.post("/api/v1/users/login", loginUserData);

    dispatch({
      type: AUTH_USER,
      payload: {
        token: user.data.token,
        user: user.data.user,
      },
    });

    history.push(conversations);
  } catch (err) {
    dispatch({
      type: LOGIN_USER_DATA,
      payload: {
        ...loginUserData,
        loginFailed: true,
        state: "failed",
      },
    });
  }
};

export const setForgotPassword = (email, state, mount) => {
  if (mount) {
    return {
      type: FORGOT_PASSWORD,
      payload: {
        email,
        state,
      },
    };
  } else {
    return {
      type: FORGOT_PASSWORD,
      payload: null,
    };
  }
};

export const sendForgotPassword = () => async (dispatch, getState) => {
  const { email } = getState().forgotPassword;

  dispatch({
    type: FORGOT_PASSWORD,
    payload: {
      email,
      state: "submitting",
    },
  });

  try {
    await axios.post("/api/v1/users/forgotPassword", { email });
    dispatch({
      type: FORGOT_PASSWORD,
      payload: {
        email,
        state: "submitted",
      },
    });
  } catch (err) {
    dispatch({
      type: FORGOT_PASSWORD,
      payload: {
        email,
        state: "failed",
      },
    });
  }
};

export const setResetPassword = (mount, password, confirmPassword, state) => {
  if (mount) {
    return {
      type: RESET_PASSWORD_DATA,
      payload: {
        password,
        confirmPassword,
        state,
      },
    };
  } else {
    return {
      type: RESET_PASSWORD_DATA,
      payload: null,
    };
  }
};

export const resetPassword = (token) => async (dispatch, getState) => {
  const { resetPasswordData } = getState();

  dispatch({
    type: RESET_PASSWORD_DATA,
    payload: {
      ...resetPasswordData,
      state: "submitting",
    },
  });

  try {
    const user = await axios.patch(
      `/api/v1/users/resetPassword/${token}`,
      resetPasswordData
    );

    dispatch({
      type: AUTH_USER,
      payload: {
        token: user.data.token,
        user: user.data.user,
      },
    });

    history.push(conversations);
  } catch (err) {
    dispatch({
      type: RESET_PASSWORD_DATA,
      payload: {
        ...resetPasswordData,
        state: newUserDataState.invalidToken,
      },
    });
  }
};

export const getMe = () => async (dispatch, getState) => {
  const { auth } = getState();
  try {
    const updateActiveState = await axios.patch(
      "/api/v1/users/updateMe",
      {
        isUserActive: true,
      },
      {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      }
    );

    dispatch({
      type: AUTH_USER,
      payload: {
        ...auth,
        user: updateActiveState.data.user,
      },
    });
    history.push(conversations);
  } catch (err) {
    history.push(login);
    console.log(err);
  }
};

export const getConversations = () => async (dispatch, getState) => {
  const { auth } = getState();

  try {
    const conversations = await axios.get("/api/v1/conversations", {
      headers: {
        authorization: `Bearer ${auth.token}`,
      },
    });

    let count = 0;
    conversations.data.conversations.forEach((con) => {
      const lastMsg = con.messages[con.messages.length - 1];

      if (!lastMsg || lastMsg.user !== auth.user._id) {
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
  } catch (err) {
    history.push(login);
  }
};

export const getUsers = () => async (dispatch, getState) => {
  const { auth } = getState();

  try {
    const users = await axios.get("/api/v1/users", {
      headers: {
        authorization: `Bearer ${auth.token}`,
      },
    });

    dispatch({
      type: USERS,
      payload: [...users.data.users],
    });
  } catch (err) {
    history.push(login);
  }
};

export const setActiveConversation = (conversation) => {
  return {
    type: ACTIVE_CONVERSATION,
    payload: conversation,
  };
};

export const createConversation = (id) => async (dispatch, getState) => {
  const { auth } = getState();

  dispatch({
    type: ACTIVE_CONVERSATION,
    payload: {
      state: "creating",
      id,
    },
  });

  try {
    await axios.post(
      "/api/v1/conversations",
      { user1: auth.user._id, user2: id, createdAt: Date.now() },
      {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      }
    );
  } catch (err) {
    dispatch({
      type: ACTIVE_CONVERSATION,
      payload: {
        state: "failed",
      },
    });
  }
};

export const setMessageData = (message, state) => {
  return {
    type: MESSAGE_DATA,
    payload: {
      message,
      state,
    },
  };
};

export const sendMessage = () => async (dispatch, getState) => {
  const { message, auth, activeConversation } = getState();

  dispatch({
    type: MESSAGE_DATA,
    payload: {
      message: message.message,
      state: "submitting",
    },
  });

  try {
    await axios.post(
      "/api/v1/messages",
      {
        conversation: activeConversation._id,
        user: auth.user._id,
        message: message.message,
        createdAt: Date.now(),
      },
      {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      }
    );

    dispatch({
      type: MESSAGE_DATA,
      payload: {
        message: "",
        state: "submitted",
      },
    });
  } catch (err) {
    dispatch({
      type: MESSAGE_DATA,
      payload: {
        message: message.message,
        state: "failed",
      },
    });
  }
};

export const userInserted = (user) => (dispatch, getState) => {
  const { users } = getState();
  if (users.findIndex((sUser) => sUser._id === user._id) === -1) {
    const newUsers = [...users, user];

    dispatch({
      type: USERS,
      payload: [...newUsers],
    });
  }
};

export const userUpdated = (updates) => (dispatch, getState) => {
  let { users } = getState();

  let updatedUser;
  let i;
  for (i = 0; i < users.length; i++) {
    if (users[i]._id === updates.id) {
      updatedUser = {
        ...users[i],
        ...updates.updatedFields,
      };
      break;
    }
  }

  users = [...users.slice(0, i), updatedUser, ...users.slice(i + 1)];

  dispatch({
    type: USERS,
    payload: users,
  });
};

export const userDeleted = (id) => (dispatch, getState) => {
  const { users } = getState();

  const newUsers = users.filter((user) => user._id !== id);

  dispatch({
    type: USERS,
    payload: [...newUsers],
  });
};

export const conversationInserted = (doc) => (dispatch, getState) => {
  let { conversations, auth, activeConversation } = getState();

  // insert conversation only if it is for auth user
  if (doc.user1 === auth.user._id || doc.user2 === auth.user._id) {
    if (conversations.data.findIndex((con) => con._id === doc._id) === -1) {
      conversations.data = [...conversations.data, doc];

      let count = 0;
      conversations.data.forEach((con) => {
        const lastMsg = con.messages[con.messages.length - 1];

        if (!lastMsg || lastMsg.user !== auth.user._id) {
          count++;
        }
      });

      dispatch({
        type: CONVERSATIONS,
        payload: {
          data: [...conversations.data],
          notifications: count,
        },
      });

      if (activeConversation && activeConversation.id) {
        dispatch({
          type: ACTIVE_CONVERSATION,
          payload: doc,
        });
      }
    }
  }
};

export const conversationDeleted = (id) => (dispatch, getState) => {
  let { conversations, auth, activeConversation } = getState();

  if (activeConversation._id === id) {
    dispatch({
      type: ACTIVE_CONVERSATION,
      payload: null,
    });
  }

  conversations.data = conversations.data.filter((con) => con._id !== id);

  let count = 0;
  conversations.data.forEach((con) => {
    const lastMsg = con.messages[con.messages.length - 1];

    if (!lastMsg || lastMsg.user !== auth.user._id) {
      count++;
    }
  });

  dispatch({
    type: CONVERSATIONS,
    payload: {
      data: [...conversations.data],
      notifications: count,
    },
  });
};

export const messageInserted = (doc) => (dispatch, getState) => {
  const { conversations, auth } = getState();

  let i = conversations.data.findIndex((con) => con._id === doc.conversation);

  if (i >= 0) {
    if (
      conversations.data[i].messages.findIndex((el) => el._id === doc._id) ===
      -1
    ) {
      conversations.data[i].messages = [...conversations.data[i].messages, doc];

      const newConversations = [...conversations.data];

      let count = 0;
      newConversations.forEach((con) => {
        const lastMsg = con.messages[con.messages.length - 1];

        if (!lastMsg || lastMsg.user !== auth.user._id) {
          count++;
        }
      });

      dispatch({
        type: CONVERSATIONS,
        payload: {
          data: newConversations,
          notifications: count,
        },
      });

      if (doc.user === auth.user._id) {
        dispatch({
          type: ACTIVE_CONVERSATION,
          payload: newConversations[i],
        });
      }
    }
  }
};

export const updateOnlineState = (state) => async (dispatch, getState) => {
  const { auth } = getState();

  try {
    await axios.patch(
      "/api/v1/users/updateMe",
      {
        isUserActive: state,
      },
      {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      }
    );
  } catch (err) {
    history.push(login);
  }
};

const emojiUnicode = (emoji) => {
  let comp;
  if (emoji.length === 1) {
    comp = emoji.charCodeAt(0);
  }
  comp =
    (emoji.charCodeAt(0) - 0xd800) * 0x400 +
    (emoji.charCodeAt(1) - 0xdc00) +
    0x10000;
  if (comp < 0) {
    comp = emoji.charCodeAt(0);
  }
  return comp.toString("16");
};

export const addEmoji = (id) => (dispatch, getState) => {
  const { message } = getState();

  const emojiUni = emojiUnicode(EMOJIS.slice(id, id + 2));

  let emoji = String.fromCodePoint("0x" + emojiUni);

  dispatch({
    type: MESSAGE_DATA,
    payload: {
      ...message,
      message: message.message + emoji,
    },
  });
};

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
  PROFILE_DATA,
  CHANGE_PASSWORD,
} from "./types";
import axios from "../utils/axios";
import history from "../utils/history";
import { emailConfirmation, root } from "../utils/Routes";
import EMOJIS from "../utils/emojis";
import { saveToken, loadDataHelper } from "./helper";

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

    saveToken(user.data.token);

    history.push("/conversations");

    loadDataHelper(dispatch, user.data.token, true, true, user.data.user);
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
        user: user.data.user,
      },
    });

    saveToken(user.data.token);

    history.push("/conversations");

    loadDataHelper(dispatch, user.data.token, true, true, user.data.user);
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

    saveToken(user.data.token);

    history.push("/conversations");

    loadDataHelper(dispatch, user.data.token, true, true, user.data.user);
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

export const setActiveConversation = (conversation) => {
  return {
    type: ACTIVE_CONVERSATION,
    payload: conversation,
  };
};

export const createConversation = (id) => async (dispatch, getState) => {
  const { auth } = getState();

  const token = localStorage.getItem("token");

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
          authorization: `Bearer ${token}`,
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

  const token = localStorage.getItem("token");

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
          authorization: `Bearer ${token}`,
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
  let { users, auth } = getState();

  let updatedUser;
  let i = users.findIndex((user) => user._id === updates.id);

  if (i < 0) return;

  updatedUser = {
    ...users[i],
    ...updates.updatedFields,
  };

  if (auth.user._id === updates.id) {
    dispatch({
      type: AUTH_USER,
      payload: {
        ...auth,
        user: updatedUser,
      },
    });
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

export const conversationDeleted = (data) => (dispatch, getState) => {
  let { conversations, auth, activeConversation } = getState();

  if (activeConversation && activeConversation._id === data._id) {
    dispatch({
      type: ACTIVE_CONVERSATION,
      payload: null,
    });
  }

  conversations.data = conversations.data.filter((con) => con._id !== data._id);

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

export const addEmoji = (id) => (dispatch, getState) => {
  const { message } = getState();

  let emoji = EMOJIS.slice(id, id + 2);

  dispatch({
    type: MESSAGE_DATA,
    payload: {
      ...message,
      message: message.message + emoji,
    },
  });
};

export const setProfileData = (username, email) => {
  return {
    type: PROFILE_DATA,
    payload: {
      username,
      email,
    },
  };
};

export const saveProfileData = () => async (dispatch, getState) => {
  const { profileData } = getState();

  const userAvatar = document.querySelector(".user-avatar");
  const formData = new FormData();
  formData.append("username", profileData.username);
  formData.append("email", profileData.email);

  if (userAvatar.files.length) {
    formData.append("avatar", userAvatar.files[0]);
  }

  dispatch({
    type: PROFILE_DATA,
    payload: {
      ...profileData,
      state: "saving",
    },
  });

  const token = localStorage.getItem("token");

  try {
    await axios.patch("/api/v1/users/updateMe", formData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: PROFILE_DATA,
      payload: {
        ...profileData,
        state: "saved",
      },
    });

    setTimeout(() => {
      dispatch({
        type: PROFILE_DATA,
        payload: {
          ...profileData,
          state: "",
        },
      });
    }, 3000);

    if (userAvatar.files.length) window.location.reload();
  } catch (err) {
    dispatch({
      type: PROFILE_DATA,
      payload: {
        ...profileData,
        state: "failed",
      },
    });
    console.log(err);
  }
};

export const setChangePasswordData = (
  currentPassword,
  newPassword,
  confirmPassword
) => {
  return {
    type: CHANGE_PASSWORD,
    payload: {
      currentPassword,
      newPassword,
      confirmPassword,
    },
  };
};

export const saveNewPassword = () => async (dispatch, getState) => {
  const { changePassword } = getState();

  if (changePassword.newPassword.length < 12) {
    dispatch({
      type: CHANGE_PASSWORD,
      payload: {
        ...changePassword,
        state: "validation,New password length should be greater than 12.",
      },
    });
    return;
  } else if (changePassword.newPassword !== changePassword.confirmPassword) {
    dispatch({
      type: CHANGE_PASSWORD,
      payload: {
        ...changePassword,
        state: "validation,New password and Confirm password are not same.",
      },
    });
    return;
  }

  dispatch({
    type: CHANGE_PASSWORD,
    payload: {
      ...changePassword,
      state: "saving",
    },
  });

  const token = localStorage.getItem("token");

  try {
    const user = await axios.patch(
      "/api/v1/users/updatePassword",
      changePassword,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    saveToken(user.data.token);

    dispatch({
      type: CHANGE_PASSWORD,
      payload: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        state: "saved",
      },
    });

    setTimeout(() => {
      dispatch({
        type: CHANGE_PASSWORD,
        payload: {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          state: "",
        },
      });
    }, 3000);
  } catch (err) {
    dispatch({
      type: CHANGE_PASSWORD,
      payload: {
        ...changePassword,
        state: "failed",
      },
    });
  }
};

export const logout = () => async (dispatch, getState) => {
  dispatch({
    type: AUTH_USER,
    payload: {},
  });

  dispatch({
    type: CONVERSATIONS,
    payload: { data: [], notifications: 0 },
  });

  dispatch({
    type: USERS,
    payload: [],
  });

  localStorage.setItem("token", "");

  await axios.get("/api/v1/users/logout");
};

export const deleteAccount = () => async (dispatch, getState) => {
  const token = localStorage.getItem("token");

  try {
    await axios.delete("/api/v1/users/deleteMe", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    history.push(root);
  } catch (err) {
    console.log(err);
  }
};

export const loadData = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  loadDataHelper(dispatch, token, true, true, false, true);
};

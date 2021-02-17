import { NEW_USER_DATA, newUserDataState } from "./types";
import axios from "../utils/axios";
import history from "../utils/history";
import { emailConfirmation, conversations } from "../utils/Routes";

export const setNewUserData = (
  newUser,
  username,
  email,
  password,
  confirmpassword,
  state
) => {
  if (newUser) {
    return {
      type: NEW_USER_DATA,
      payload: {
        username,
        email,
        password,
        confirmpassword,
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
      confirmpassword: "",
      state: newUserDataState.activatingAccount,
    },
  });
  try {
    await axios.get(`/api/v1/users/activateAccount/${token}`);
    dispatch({
      type: NEW_USER_DATA,
      payload: {
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
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
        confirmpassword: "",
        state: newUserDataState.invalidToken,
      },
    });
  }
};

import { NEW_USER_DATA } from "./types";

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

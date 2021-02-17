import { NEW_USER_DATA, AUTH_USER } from "../actions/types";

export const newUserData = (state = null, action) => {
  switch (action.type) {
    case NEW_USER_DATA:
      return action.payload;
    default:
      return state;
  }
};

export const authUser = (state = {}, action) => {
  switch (action.type) {
    case AUTH_USER:
      return action.payload;
    default:
      return state;
  }
};

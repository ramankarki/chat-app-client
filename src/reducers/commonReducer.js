import { NEW_USER_DATA } from "../actions/types";

const newUserData = (state = null, action) => {
  switch (action.type) {
    case NEW_USER_DATA:
      return action.payload;
    default:
      return state;
  }
};

export default newUserData;

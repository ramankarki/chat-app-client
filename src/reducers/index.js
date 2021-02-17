import { combineReducers } from "redux";
import { newUserData, authUser } from "./commonReducer";

export default combineReducers({
  newUserData: newUserData,
  auth: authUser,
});

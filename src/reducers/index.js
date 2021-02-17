import { combineReducers } from "redux";
import { newUserData, authUser, loginUserData } from "./commonReducer";

export default combineReducers({
  newUserData,
  loginUserData,
  auth: authUser,
});

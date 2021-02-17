import { combineReducers } from "redux";
import commonReducer from "./commonReducer";
import {
  FORGOT_PASSWORD,
  NEW_USER_DATA,
  AUTH_USER,
  LOGIN_USER_DATA,
} from "../actions/types";

export default combineReducers({
  newUserData: commonReducer(NEW_USER_DATA, null),
  loginUserData: commonReducer(LOGIN_USER_DATA, null),
  auth: commonReducer(AUTH_USER, {}),
  forgotPassword: commonReducer(FORGOT_PASSWORD, null),
});

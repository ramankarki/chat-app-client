import { combineReducers } from "redux";
import commonReducer from "./commonReducer";

export default combineReducers({
  newUserData: commonReducer,
});

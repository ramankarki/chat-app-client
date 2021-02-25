export const SIGNUP_USER = "SIGNUP_USER";
export const NEW_USER_DATA = "NEW_USER_DATA";
export const AUTH_USER = "AUTH_USER";
export const LOGIN_USER_DATA = "LOGIN_USER_DATA";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";
export const RESET_PASSWORD_DATA = "RESET_PASSWORD_DATA";
export const CONVERSATIONS = "CONVERSATIONS";
export const USERS = "USERS";
export const ACTIVE_CONVERSATION = "ACTIVE_CONVERSATION";
export const MESSAGE_DATA = "MESSAGE_DATA";
export const PROFILE_DATA = "PROFILE_DATA";
export const CHANGE_PASSWORD = "CHANGE_PASSWORD";
export const APP_DATA_LOADING = "APP_DATA_LOADING";

export const newUserDataState = {
  emptyFields: "empty fields",
  typing: "typing",
  submitting: "submitting",
  submitted: "submitted",
  resubmitting: "resubmitting",
  activatingAccount: "activatingAccount",
  accountActivated: "accountActivated",
  emailNotExist:
    "failed,Something went wrong! Maybe user with this email doesn't exist or is invalid",
  invalidToken: "Invalid Token",
  failed:
    "failed,Something went wrong! Maybe user with this email already exists or is invalid",
  lengthValidation: "validation,Password length should be greater than 12",
  unmatchedValidation: "validation,Password and Confirm password are not same",
};

export const saveToken = (token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("exp", Date.now() + 30 * 24 * 60 * 60 * 1000);
};

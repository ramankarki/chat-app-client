module.exports = {
  PUSHER_KEY: process.env.REACT_APP_PUSHER_KEY,
  PUSHER_CLUSTER: process.env.REACT_APP_PUSHER_CLUSTER,
};

// if (process.env.REACT_APP_CHAT_APP === "development") {
//   module.exports = require("./dev");
// } else {
//   module.exports = {
//     PUSHER_KEY: process.env.PUSHER_KEY,
//     PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
//   };
// }

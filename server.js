const app = require("./src/app");
require("dotenv").config();

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
  console.log("Backend start with port: " + PORT);
});

// process.on("SIGINT", () => {
//   server.close(() => console.log("Exit Server Express"));
// });

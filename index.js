const winston = require("winston");
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const app = express();

app.use(cors());
app.use(express.static("public"));

require("./startup/logging")();
require("./startup/config")();
require("./startup/db")();
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/prod")(app);

// if (app.get("env") === "development") {
//   app.use(morgan("tiny"));
//   debug("Morgan enabled...");
// }

const server = http.createServer(app);
const io = socketIo(server);

// exploit io ...
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.emit("message", "Backend received you");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const port = process.env.PORT || 4002;
server.listen(port, () => console.log(`Server running on port ${port}`));

// const server = app.listen(port, () =>
//   winston.info(`Listening on port ${port}...`)
// );

module.exports = server;

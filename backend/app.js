require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const { Server } = require("socket.io");
const config = require("./config");
const routeHandler = require("./routes");
const utils = require("./utils");
const cors = require("cors");

const app = express();

////////////////////////////////////////
//              CORS
////////////////////////////////////////
app.use(cors());

////////////////////////////////////////
//              body parser
////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

////////////////////////////////////////
//              Database
////////////////////////////////////////
function setupDatabase() {
  try {
    return new MongoClient(
      utils.buildDbUri(config.database.host, config.database.password)
    );
  } catch (error) {
    console.log(error);
  }

  return null;
}

const dbClient = setupDatabase();

if (dbClient) {
  config.database.client = dbClient;
  config.database.db = dbClient.db("ticketexpressdb");
} else {
  console.log("Failed to connect to database");
  //process.exit(1);
}

////////////////////////////////////////
//              Sockets
////////////////////////////////////////
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: /http:\/\/localhost:[0-9]+/,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("new connection");
  
//   socket.on("ticket:book", (payload) => {
//     console.log("ticket:book");
//   });

//   socket.on("ticket:hold", (payload) => {
//     console.log("ticket:hold");

//     setTimeout(() => {
//       console.log("Release");
//       socket.io.emit("ticket:hold", { ticket: 123 });
//     }, 1000);
//   });

//   socket.on("ticket:release", (payload) => {
//     console.log("ticket:release");
//   });

  socket.on("disconnect", () => {
    console.log("Session disconnected");
  });

});

config.io = io;

// setup routes
app.use("/", routeHandler(config));

httpServer.listen(30000, () => {
  console.log("listening on *:30000");
});

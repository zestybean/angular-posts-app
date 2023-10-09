const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

// The normalizePort function ensures that the port is a valid number, string, or false.
const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// The onError function is listening for various events and handles them appropriately.
const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  // The bind variable is used to tell the user what exactly is wrong.
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// The onListening function simply logs that the server is running.
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

// The normalizePort function ensures that the port is a valid number, string, or false.
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// The createServer function creates a server and passes the Express app as an argument.
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

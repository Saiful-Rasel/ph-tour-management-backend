import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVar } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVar.db_url as string);
    console.log("mongodb connected");
    server = app.listen(envVar.port, () => {
      console.log("app is listening on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

process.on("SIGTERM", () => {
  console.log("uhhanlde rejection");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.log("uhhanlde rejection", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log("uncaughtException rejection", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Promise.reject(new Error("I forgot to handle promis"))
// throw new Error("i forgot to handle")
//unhandle rejection error
//uncaught rejection error
//signal termination

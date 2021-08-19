import express from "express";
import { createServer } from "http";
import path from "path";
import * as socketIO from "socket.io";

export const app: express = express();
export const server = createServer(app);
export const io: socketIO.Server = require("socket.io")(server);

import "./browser/index";

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "..", "..", "/src/website/views"));
app.use("/static", express.static(path.join(__dirname, "..", "..", "/src/website/public")));

export const start = async (port: number = 5000) => {
    server.listen(port);
}

export const appVersion = Date.now();
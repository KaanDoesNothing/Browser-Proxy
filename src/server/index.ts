import {start, app} from "./lib/server";

app.get("/", (req, res) => {
    return res.render("index");
});

let port = parseInt(process.env.PORT) || 5000;

start(port);
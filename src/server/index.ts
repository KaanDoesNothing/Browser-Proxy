import {start, app} from "./lib/server";

app.get("/", (req, res) => {
    return res.render("index");
});

start(5000);
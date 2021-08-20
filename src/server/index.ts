import {start, app} from "./lib/server";

app.get("/", (req, res) => {
    return res.render("index");
});

start(parseInt(process.env.PORT) ?? 5000);
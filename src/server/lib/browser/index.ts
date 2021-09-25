import cheerio from "cheerio";
import {app, io} from "../server";
import {createBrowser, getBrowser, getPage, setBrowser} from "./browser";

import socket_screen from "./screen";
import socket_navigation from "./navigation";
import socket_input from "./input";
import Screenshotter from "../screenshotter";

io.on("connection", async (socket) => {
    let screenRefreshInterval;

    socket.emit("event", {type: "set_status", data: "Connected"});

    let initData: {viewport: {height: number, width: number}, quality: number, refresh_rate: number} = await new Promise((resolve, reject) => {
        socket.on("init_data", (data) => {
            resolve(data);
            console.log(data);

            if(!data.viewport) reject({});
        });
    });

    setBrowser(socket.id, await createBrowser(initData));

    socket.emit("event", {type: "browser_ready"});
    socket.emit("event", {type: "set_status", data: "Running"});

    socket_screen({socket});
    socket_navigation({socket});
    socket_input({socket});

    let page = await getPage(socket.id);

    page.on("load", () => {
        if(screenRefreshInterval) clearInterval(screenRefreshInterval);

        socket.emit("event", {type: "set_url", data: page.url()});

        page.emulateMediaFeatures([{
            name: "prefers-color-scheme", value: "dark" }]);
    });

    socket.on("disconnect", async () => {
        clearInterval((screenRefreshInterval));
        await getBrowser(socket.id).close();

        // screenshotter.stop();
    });

    async function startStreaming() {
        screenRefreshInterval = setInterval(async () => {
            const page = await getPage(socket.id);

            if(page.isClosed()) return;

            const screenshot = await page.screenshot({
                fullPage: false,
                omitBackground: false,
                quality: initData.quality,
                type: "jpeg"
            }).catch(err => {
                clearInterval(screenRefreshInterval);
            });

            socket.emit("event", {type: "update_frame", data: screenshot});
        }, initData.refresh_rate);
    }

    let screenshotter = new Screenshotter();
    await screenshotter.run(page);

    screenshotter.on("ready", () => console.log("Screenshotter ready"));
    screenshotter.on("screenshot", (frameObject) => {
        console.log("Frame Update");
        socket.emit("event", {type: "update_frame", data: new Buffer(frameObject.data, "base64")});
    });


});
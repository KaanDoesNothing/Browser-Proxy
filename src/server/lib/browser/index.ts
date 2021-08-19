import {io} from "../server";
import {createBrowser, getBrowser, getPage, setBrowser} from "./browser";

import socket_screen from "./screen";
import socket_navigation from "./navigation";
import socket_input from "./input";

io.on("connection", async (socket) => {
    let screenRefreshInterval

    socket.emit("event", {type: "set_status", data: "Connected"});

    let initData = await new Promise((resolve, reject) => {
        socket.on("init_data", (data) => {
            resolve(data);

            if(!data.viewport) reject(false);
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
        startStreaming();

        socket.emit("event", {type: "set_url", data: page.url()});
    });

    socket.on("disconnect", async () => {
        console.log("Disconnected");
        clearInterval((screenRefreshInterval));
        await getBrowser(socket.id).close();
    });

    async function startStreaming() {
        screenRefreshInterval = setInterval(async () => {
            const page = await getPage(socket.id);

            if(page.isClosed()) return;

            const screenshot = await page.screenshot({
                fullPage: false,
                omitBackground: false,
                quality: 20,
                type: "jpeg"
            }).catch(err => console.log(err));

            socket.emit("event", {type: "update_frame", data: screenshot});
        }, 10);
    }

});
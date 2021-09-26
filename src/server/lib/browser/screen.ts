import { Socket } from "socket.io";
import { getPage } from "./browser";
import Screenshotter from "../screenshotter";
import {screenshots} from "./cache";

let screenshotter = new Screenshotter();

export default async ({socket}: {socket: Socket}) => {
    socket.on("set_viewport", async (viewport) => {
        let page = await getPage(socket.id);

        await page.setViewport(viewport);
    });

    let screenshotter = new Screenshotter();
    await screenshotter.run(await getPage(socket.id));

    screenshotter.on("ready", () => console.log("Screenshotter ready"));
    screenshotter.on("screenshot", (frameObject) => {
        console.log("Frame Update");
        // socket.emit("event", {type: "update_frame", data: new Buffer(frameObject.data, "base64")});
        let buffer = new Buffer(frameObject.data, "base64");
        screenshots[socket.id] = buffer;
        socket.emit("event", {type: "update_frame", data: buffer});
    });
}
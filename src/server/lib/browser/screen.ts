import { Socket } from "socket.io";
import { getPage } from "./browser";

export default ({socket}: {socket: Socket}) => {
    socket.on("set_viewport", async (viewport) => {
        let page = await getPage(socket.id);

        await page.setViewport(viewport);
    });
}
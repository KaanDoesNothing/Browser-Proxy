import { Socket } from "socket.io";
import { getPage } from "./browser";
import {fixURL} from "../utils";

export default ({socket}: {socket: Socket}) => {
    socket.on("navigation", async (e) => {
        let page = await getPage(socket.id);

        switch(e.type) {
            case "goto":
                await page.goto(fixURL(e.data)).catch(err => console.log("Couldn't navigate", err));
                break;
            case "go_back":
                await page.goBack();
                break;
            case "go_forward":
                await page.goForward();
                break;
            case "reload":
                await page.reload();
                break;
            default:
                console.log("Hm");
                break;
        }
    });
}
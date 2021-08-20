import { Socket } from "socket.io";
import { getPage } from "./browser";
import {keyboardMap} from "../keyboardMap";

export default async ({socket}: {socket: Socket}) => {
    let page = await getPage(socket.id);

    socket.on("input", async (e) => {
        switch(e.type) {
            case "key":
                let processedKey = e.data.key;

                if(e.data.action === "up") {
                    await page.keyboard.up(processedKey).catch(err => console.log(`Error key: ${processedKey}`));
                }else {
                    await page.keyboard.down(processedKey).catch(err => console.log(`Error key: ${processedKey}`));
                }

                break;
            case "mouse_move":
                await page.mouse.move(e.data.x, e.data.y).catch(err => console.log(err));
                break;
            case "mouse_down":
                await page.mouse.down().catch(err => console.log(err));
                break;
            case "mouse_up":
                await page.mouse.up().catch(err => console.log(err));
                break;
            case "scroll_wheel":
                let direction: any = e.data === 100 ? "ArrowDown" : "ArrowUp";
                await page.keyboard.press(direction);
                break;
            default:
                return;
                break;
        }
    });
}
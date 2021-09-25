import {EventEmitter} from "events";
import {Page} from "puppeteer";

export default class Screenshotter extends EventEmitter {
    constructor() {
        super();
    }

    async run(page: Page) {
        let client = await page.target().createCDPSession();

        client.on("Page.screencastFrame", async (frameObject) => {
            await client.send("Page.screencastFrameAck", { sessionId: frameObject.sessionId});
            this.emit("screenshot", frameObject);
        });

        const startOptions = {
            format: "jpeg",
            quality: 100,
            maxWidth: 1920,
            maxHeight: 1080,
            everyNthFrame: 1
        };

        client.send("Page.startScreencast", startOptions as any);


        this.emit("ready");
    }

    stop() {

    }
}
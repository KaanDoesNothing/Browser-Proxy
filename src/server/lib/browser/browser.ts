import puppeteer from "puppeteer";

import puppeteerExtra from "puppeteer-extra"
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import adBlockerPlugin from "puppeteer-extra-plugin-adblocker";

puppeteerExtra.use(stealthPlugin());
puppeteerExtra.use(adBlockerPlugin());

import { browsers, screenshots } from "./cache";

export let createBrowser = async ({viewport}: any) => {
    const browser = await puppeteerExtra.launch({
        headless: true,
        defaultViewport: viewport || null,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu"
        ]
    });
    
    return browser;
}

export let getBrowser = (id) => {
    return browsers[id];
}

export let setBrowser = (id, browser) => {
    browsers[id] = browser;

    return true;
}

export let getPage = async (id) => {
    return (await getBrowser(id).pages())[0] as puppeteer.Page;
}
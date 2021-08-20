import puppeteer from "puppeteer"
import { browsers } from "./cache";

export let createBrowser = async ({viewport}: any) => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: viewport,
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
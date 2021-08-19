import puppeteer from "puppeteer"
import { browsers } from "./cache";

export let createBrowser = async ({viewport}: any) => {
    const browser = await puppeteer.launch({headless: true, defaultViewport: viewport});
    
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
    return (await getBrowser(id).pages())[0];
}
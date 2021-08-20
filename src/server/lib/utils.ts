export let fixURL = (url: string) => {
    if(url.includes("https://") || url.includes("http://")) {
        return url;
    }else {
        return `https://${url}`;
    }
}

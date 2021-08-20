export let fixURL = (url: string) => {
    if(!url.startsWith("https://") || !url.startsWith("http://")) {
        url = `https://${url}`;
    }

    return url;
}

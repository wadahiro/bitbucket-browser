export function baseUrl(url: string) {
    const last = url.substring(url.length - 1);
    if (last === '/') {
        return url.substring(0, url.length - 1)
    }
    return url;
}
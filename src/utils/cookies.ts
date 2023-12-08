export function cookiesSplitter(cookie: string) {
    return cookie.split(/\s{0,}\;\s{0,}/g).map((v) => v.trim())
}

export function cookieValueFinder(cookie: string, key: string) {
    return cookiesSplitter(cookie)
        .find((v) => v.includes(key))
        .split('=')
        .pop()
        .trim()
}

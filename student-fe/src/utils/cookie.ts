import Cookies from "universal-cookie";

const cookies = new Cookies()


export function setTokens(accessToken: string, refreshToken: string) {
    cookies.set("access-token", accessToken, { path: "/" })
    cookies.set("refresh-token", refreshToken, { path: "/" })
}

export function removeTokens() {
    cookies.remove("access-token")
    cookies.remove("refresh-token")
}

export function getAccessToken() {
    return cookies.get("access-token")
}
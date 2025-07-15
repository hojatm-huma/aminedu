import { getAccessToken, getRefreshToken } from "@/utils/tokens"


import { myAxios } from './base';


export interface Credentials {
    username: string;
    password: string;
}

export async function getToken(cred: Credentials) {
    const { data } = await myAxios.post('/accounts/token/', {
        username: cred.username,
        password: cred.password
    });
    return data;
}

export interface RefreshTokenOutput {
    access: string;
    refresh: string;
}

export async function refreshToken(): Promise<RefreshTokenOutput> {
    const accessToken_ = getAccessToken()
    const refreshToken_ = getRefreshToken()


    const { data } = await myAxios.post(
        '/accounts/token/refresh/',
        {
            refresh: refreshToken_
        },
        {
            headers: { "Authorization": `Bearer ${accessToken_}` }
        }
    );

    return data
}
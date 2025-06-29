import axios from "axios";
import Cookies from 'universal-cookie';

import { setTokens } from "src/utils/cookie";

import { myAxios } from './base';

const cookies = new Cookies()

export interface Credentials {
    username: string;
    password: string;
}

export async function getToken(cred: Credentials) {
    const { data } = await myAxios.post('/accounts/token/', {
        username: cred.username,
        password: cred.password
    });
    const { access, refresh } = data
    setTokens(access, refresh)

    return data;
}

export interface RefreshTokenOutput {
    access: string;
    refresh: string;
}

export async function refreshToken(): Promise<RefreshTokenOutput> {
    const accessToken_ = cookies.get("access-token")
    const refreshToken_ = cookies.get("refresh-token")


    const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/accounts/token/refresh/`,
        {
            refresh: refreshToken_
        },
        {
            // headers: { "Authorization": `Bearer ${accessToken_}` }
        }
    );

    return data
}
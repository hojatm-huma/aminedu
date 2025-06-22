import { myAxios } from './base';

export interface Credentials {
    username: string;
    password: string;
}
export async function login(cred: Credentials) {
    const { data } = await myAxios.post('/accounts/token/', {
        username: cred.username,
        password: cred.password
    });
    return data;
}

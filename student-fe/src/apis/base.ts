import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies()

export const myAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    headers: { "Authorization": `Bearer ${cookies.get("access-token")}` },
})
import { accountApi } from "@/libs/apis/accounts";

export function useAccounts() {
    return {
        getToken: accountApi.getToken
    }
}
import {AuthLoginRequest, AuthLoginResponse} from "../types/auth";
import {baseUrl} from "../constant/api";

export const authLogin = async (input: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(input),
        headers: { 'Content-Type': 'application/json' },
    });
    return (await res.json()) as AuthLoginResponse;
}
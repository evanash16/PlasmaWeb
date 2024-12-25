import {AuthIdentityRequest, AuthIdentityResponse, AuthLoginRequest, AuthLoginResponse} from "../types/auth";
import {baseUrl} from "../constant/api";
import {SESSION_ID_HEADER} from "../constant/header";
import {useCookies} from "react-cookie";
import {SESSION_ID_COOKIE} from "../constant/cookie";
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {QueryKey} from "../constant/query";

export const authLogin = async (input: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(input),
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
        return Promise.reject(res.json());
    }
    return (await res.json()) as AuthLoginResponse;
}

const authIdentity = async (input: AuthIdentityRequest): Promise<AuthIdentityResponse> => {
    const { id } = input;
    const res = await fetch(`${baseUrl}/auth/identity`, {
        method: 'GET',
        headers: { [SESSION_ID_HEADER]: id }
    });
    if (!res.ok) {
        return Promise.reject(res.json());
    }
    return (await res.json()) as AuthIdentityResponse;
}

export const useAuthIdentity = (): UseQueryResult<AuthIdentityResponse, Error> => {
    const [cookies] = useCookies([SESSION_ID_COOKIE]);
    const sessionId: string | undefined = cookies[SESSION_ID_COOKIE];

    return useQuery({
        queryKey: [QueryKey.AUTH_IDENTITY, sessionId],
        queryFn: () => authIdentity({ id: sessionId! }),
        enabled: Boolean(sessionId)
    });
}
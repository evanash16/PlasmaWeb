
export interface AuthLoginRequest {
    username: string;
    password: string;
}

export interface AuthLoginResponse {
    id: string;
}

export interface AuthIdentityResponse {
    id: string;
    userId: string;
    creationTime: number;
}
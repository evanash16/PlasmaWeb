
export interface CreateUserRequest {
    username: string;
    password: string;
}

export interface CreateUserResponse {
    id: string;
}

export interface SearchUsersRequest {
    usernameSearchString: string;
    maxPageSize?: number;
    paginationToken?: string;
}

export interface SearchUsersResponse {
    users: User[];
    paginationToken?: string;
}

export interface User {
    id: string;
    username: string;
    creationTime: number;
}

export interface GetUserRequest {
    id: string;
}

export interface GetUserResponse {
    id: string;
    username: string;
    creationTime: number;
}

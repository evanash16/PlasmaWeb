
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
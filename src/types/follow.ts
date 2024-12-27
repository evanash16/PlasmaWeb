
export interface GetFollowUserRequest {
    userId: string;
}

export interface GetFollowUserResponse {
    id: string;
    followerId: string;
    followeeId: string;
    creationTime: number;
}

export interface CreateFollowUserRequest {
    userId: string;
}

export interface CreateFollowUserResponse {
    id: string;
}

export interface DeleteFollowUserRequest {
    userId: string;
}

export interface ListFollowsRequest {
    userId: string;
    sortOrder?: FollowsSortOrder;
    maxPageSize?: number;
    paginationToken?: string;
}

export enum FollowsSortOrder {
    CREATION_TIME_ASCENDING='CREATION_TIME_ASCENDING',
    CREATION_TIME_DESCENDING='CREATION_TIME_DESCENDING',
}

export interface ListFollowsResponse {
    follows: Follow[];
    paginationToken?: string;
}

export interface Follow {
    id: string;
    followerId: string;
    followeeId: string;
    creationTime: number;
}

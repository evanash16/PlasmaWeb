
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

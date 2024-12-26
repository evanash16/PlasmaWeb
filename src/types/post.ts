
export interface ListPostsRequest {
    postedById: string;
    sortOrder?: PostsSortOrder,
    maxPageSize?: number;
    paginationToken?: string;
}

export interface ListPostsResponse {
    posts: Post[];
    paginationToken?: string;
}

export interface Post {
    id: string;
    postedById: string;
    creationTime: number;
    lastModificationTime: number;
    title: string;
    body?: string;
}

export enum PostsSortOrder {
    CREATION_TIME_ASCENDING='CREATION_TIME_ASCENDING',
    CREATION_TIME_DESCENDING='CREATION_TIME_DESCENDING',
}

export interface CreatePostRequest {
    title: string;
    body?: string;
}

export interface CreatePostResponse {
    id: string;
}

export interface UpdatePostRequest {
    id: string;
    title?: string;
    body?: OptionalString;
}

export interface OptionalString {
    isRemove?: boolean;
    value?: string;
}

export interface DeletePostRequest {
    id: string;
}

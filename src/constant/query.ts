
export enum QueryKey {
    SEARCH_USERS = 'searchUsers',
    GET_USER = 'getUser',
    LIST_POSTS = 'listPosts',
    LIST_FOLLOWS = 'listFollows',
    GET_FOLLOW_USER = 'getFollowUser',
    AUTH_IDENTITY = 'authIdentity',
}

export enum MutationKey {
    CREATE_USER = 'createUser',
    CREATE_POST = 'createPost',
    UPDATE_POST = 'updatePost',
    DELETE_POST = 'deletePost',
    CREATE_FOLLOW_USER = 'createFollowUser',
    DELETE_FOLLOW_USER = 'deleteFollowUser',
}
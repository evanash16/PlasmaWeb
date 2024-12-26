import React, {useCallback, useMemo} from "react";
import flow from "lodash/flow";
import {map} from "lodash/fp";
import flatten from "lodash/fp/flatten";
import {useListPosts} from "../../api/post";
import {ListPostsResponse, Post, PostsSortOrder} from "../../types/post";
import PostContainer from "./PostContainer";
import {Box, Button, Spinner} from "@cloudscape-design/components";

export interface PostsProps {
    postedById: string;
}

const Posts = ({postedById}: PostsProps) => {
    const {
        data: listPostsResponse,
        isFetching: isListPostsFetching,
        hasNextPage: hasMorePosts,
        fetchNextPage: fetchMorePosts
    } = useListPosts({
        postedById,
        sortOrder: PostsSortOrder.CREATION_TIME_DESCENDING,
    });
    const onFetchMorePostsClick = useCallback(() => fetchMorePosts(), []);

    const posts: Post[] = useMemo(() =>
            flow(map<ListPostsResponse, Post[]>(({posts}) => posts), flatten)(listPostsResponse?.pages),
        [listPostsResponse]);
    const postContainers = useMemo(() => posts.map(post => (<PostContainer post={post}/>)), [posts]);

    return (
        <>
            {postContainers}
            <Box textAlign='center'>
                {isListPostsFetching && <Spinner size='large'/>}
                {!isListPostsFetching && hasMorePosts && <Button onClick={onFetchMorePostsClick}>Fetch more posts</Button>}
                {!isListPostsFetching && !hasMorePosts && <i>No more posts to show. :(</i>}
            </Box>
        </>
    )
}

export default Posts;
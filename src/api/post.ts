import { baseUrl } from "../constant/api";
import {CreatePostRequest, CreatePostResponse, ListPostsRequest, ListPostsResponse} from "../types/post";
import {
    InfiniteData, useInfiniteQuery,
    UseInfiniteQueryResult,
    useMutation,
    UseMutationResult,
    useQuery, useQueryClient,
    UseQueryResult
} from "@tanstack/react-query";
import {MutationKey, QueryKey} from "../constant/query";
import {useAuthIdentity} from "./auth";
import {SESSION_ID_HEADER} from "../constant/header";
import qs from "qs";

const listPosts = async (input: ListPostsRequest): Promise<ListPostsResponse> => {
    const query = qs.stringify(input, {
        skipNulls: true
    });
    const res = await fetch(`${baseUrl}/post?${query}`);
    return (await res.json()) as ListPostsResponse;
}

export const useListPosts = (input: ListPostsRequest): UseInfiniteQueryResult<InfiniteData<ListPostsResponse>, Error> => {
    return useInfiniteQuery({
        initialData: undefined,
        initialPageParam: input.paginationToken,
        queryKey: [QueryKey.LIST_POSTS, input],
        queryFn: ({ pageParam }) => listPosts({ ...input, paginationToken: pageParam as string }),
        getNextPageParam: ({ paginationToken }) => paginationToken,
    });
}

const createPost = async (sessionId: string | undefined, input: CreatePostRequest): Promise<CreatePostResponse> => {
    const res = await fetch(`${baseUrl}/post`, {
        method: "POST",
        body: JSON.stringify(input),
        headers: { "Content-Type": "application/json", ...(sessionId && { [SESSION_ID_HEADER]: sessionId }) },
    });
    return (await res.json()) as CreatePostResponse;
}

export const useCreatePost = (): UseMutationResult<CreatePostResponse, Error, CreatePostRequest> => {
    const { data: authIdentity } = useAuthIdentity();
    const queryClient = useQueryClient();

    return useMutation<CreatePostResponse, Error, CreatePostRequest>({
        mutationKey: [MutationKey.CREATE_POST],
        mutationFn: (input: CreatePostRequest) => createPost(authIdentity?.id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.LIST_POSTS],
                type: 'all',
                exact: false
            });
        }
    });
}
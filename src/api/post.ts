import { baseUrl } from "../constant/api";
import {
    CreatePostRequest,
    CreatePostResponse,
    DeletePostRequest,
    ListPostsRequest,
    ListPostsResponse,
    UpdatePostRequest
} from "../types/post";
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
import {omit} from "lodash";

const listPosts = async (input: ListPostsRequest): Promise<ListPostsResponse> => {
    const query = qs.stringify(input, {
        skipNulls: true
    });
    const res = await fetch(`${baseUrl}/post?${query}`);
    if (!res.ok) {
        return Promise.reject(res.json());
    }
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
    if (!res.ok) {
        return Promise.reject(res.json());
    }
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

const updatePost = async (sessionId: string | undefined, input: UpdatePostRequest): Promise<void> => {
    const { id } = input;
    const body = omit(input, 'id');
    const res = await fetch(`${baseUrl}/post/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json", ...(sessionId && { [SESSION_ID_HEADER]: sessionId }) },
    });
    if (!res.ok) {
        return Promise.reject();
    }
}

export const useUpdatePost = (id: string): UseMutationResult<void, Error, Omit<UpdatePostRequest, 'id'>> => {
    const { data: authIdentity } = useAuthIdentity();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [MutationKey.UPDATE_POST, id],
        mutationFn: (input: Omit<UpdatePostRequest, 'id'>) => updatePost(authIdentity?.id, { ...input, id }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [QueryKey.LIST_POSTS],
                type: 'all',
                exact: false
            });
        }
    })
}

const deletePost = async (sessionId: string | undefined, input: DeletePostRequest): Promise<void> => {
    const { id } = input;
    const res = await fetch(`${baseUrl}/post/${id}`, {
        method: 'DELETE',
        headers: { ...(sessionId && { [SESSION_ID_HEADER]: sessionId }) },
    });
    if (!res.ok) {
        return Promise.reject();
    }
}

export const useDeletePost = (id: string): UseMutationResult<void, Error, void> => {
    const { data: authIdentity } = useAuthIdentity();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [MutationKey.DELETE_POST, id],
        mutationFn: () => deletePost(authIdentity?.id, { id }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [QueryKey.LIST_POSTS],
                type: 'all',
                exact: false
            });
        }
    })
}
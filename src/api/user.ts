import qs from 'qs';

import {
    CreateUserRequest,
    CreateUserResponse,
    GetUserRequest, GetUserResponse,
    SearchUsersRequest,
    SearchUsersResponse
} from "../types/user";
import {
    InfiniteData,
    useInfiniteQuery,
    UseInfiniteQueryResult,
    useMutation,
    UseMutationResult, useQuery, useQueryClient, UseQueryResult
} from "@tanstack/react-query";
import {MutationKey, QueryKey} from "../constant/query";
import {baseUrl} from "../constant/api";

const createUser = async (input: CreateUserRequest): Promise<CreateUserResponse> => {
    const res = await fetch(`${baseUrl}/user`, {
        method: `POST`,
        body: JSON.stringify(input),
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
        return Promise.reject(res.json());
    }
    return (await res.json()) as CreateUserResponse;
}

export const useCreateUser = (): UseMutationResult<CreateUserResponse, Error, CreateUserRequest> => {
    const queryClient = useQueryClient();

    return useMutation<CreateUserResponse, Error, CreateUserRequest>({
        mutationKey: [MutationKey.CREATE_USER],
        mutationFn: (input) => createUser(input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [QueryKey.SEARCH_USERS],
                type: 'all',
                exact: false
            });
        }
    });
}

const searchUsers = async (input: SearchUsersRequest): Promise<SearchUsersResponse> => {
    const query = qs.stringify(input, {
        skipNulls: true
    });
    const res = await fetch(`${baseUrl}/user?${query}`);
    if (!res.ok) {
        return Promise.reject(res.json());
    }
    return (await res.json()) as SearchUsersResponse;
}

export const useSearchUsers = (input: SearchUsersRequest): UseInfiniteQueryResult<InfiniteData<SearchUsersResponse>, Error> => {
    return useInfiniteQuery({
        initialData: undefined,
        initialPageParam: input.paginationToken,
        queryKey: [QueryKey.SEARCH_USERS, input],
        queryFn: ({ pageParam }) => searchUsers({ ...input, paginationToken: pageParam as string }),
        getNextPageParam: (lastPage: SearchUsersResponse) => lastPage.paginationToken,
        enabled: Boolean(input.usernameSearchString),
    });
}

const getUser = async (input: GetUserRequest): Promise<GetUserResponse> => {
    const { id } = input;
    const res = await fetch(`${baseUrl}/user/${id}`);
    if (!res.ok) {
        return Promise.reject(res.json());
    }
    return (await res.json()) as GetUserResponse;
}

export const useGetUser = (input: GetUserRequest): UseQueryResult<GetUserResponse, Error> => {
    return useQuery({
        queryKey: [QueryKey.GET_USER, input],
        queryFn: () => getUser(input),
        enabled: Boolean(input.id)
    });
}
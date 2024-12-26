import {
    CreateFollowUserRequest,
    CreateFollowUserResponse, DeleteFollowUserRequest,
    GetFollowUserRequest,
    GetFollowUserResponse
} from "../types/follow";
import {baseUrl} from "../constant/api";
import {SESSION_ID_HEADER} from "../constant/header";
import {useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {useAuthIdentity} from "./auth";
import {MutationKey, QueryKey} from "../constant/query";


const getFollowUser = async (sessionId: string | undefined, input: GetFollowUserRequest): Promise<GetFollowUserResponse> => {
    const { userId } = input;
    const res = await fetch(`${baseUrl}/follow/user/${userId}`, {
        method: 'GET',
        headers: { ...(sessionId && { [SESSION_ID_HEADER]: sessionId }) },
    });
    if (!res.ok) {
        return Promise.reject(res.json());
    }
    return (await res.json()) as GetFollowUserResponse;
};

export const useGetFollowUser = (input: GetFollowUserRequest): UseQueryResult<GetFollowUserResponse, Error> => {
    const { data: authIdentity } = useAuthIdentity();

    return useQuery({
        queryKey: [QueryKey.GET_FOLLOW_USER, input],
        queryFn: () => getFollowUser(authIdentity?.id, input),
        retry: false, // assume the first request will succeed or fail with a 404, don't retry
        enabled: Boolean(input.userId && authIdentity?.id) && input.userId !== authIdentity?.userId
    });
}

const createFollowUser = async (sessionId: string | undefined, input: CreateFollowUserRequest): Promise<CreateFollowUserResponse> => {
    const { userId } = input;
    const res = await fetch(`${baseUrl}/follow/user/${userId}`, {
        method: 'POST',
        headers: { ...(sessionId && { [SESSION_ID_HEADER]: sessionId }) },
    });
    if (!res.ok) {
        return Promise.reject(res.json());
    }
    return (await res.json()) as GetFollowUserResponse;
}

export const useCreateFollowUser = (): UseMutationResult<CreateFollowUserResponse, Error, CreateFollowUserRequest> => {
    const { data: authIdentity } = useAuthIdentity();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [MutationKey.CREATE_FOLLOW_USER],
        mutationFn: (input: CreateFollowUserRequest) => createFollowUser(authIdentity?.id, input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [QueryKey.GET_FOLLOW_USER],
                type: 'all',
                exact: false,
            });
        }
    })
}
const deleteFollowUser = async (sessionId: string | undefined, input: DeleteFollowUserRequest): Promise<void> => {
    const { userId } = input;
    const res = await fetch(`${baseUrl}/follow/user/${userId}`, {
        method: 'DELETE',
        headers: { ...(sessionId && { [SESSION_ID_HEADER]: sessionId }) },
    });
    if (!res.ok) {
        return Promise.reject(res.json());
    }
}

export const useDeleteFollowUser = (): UseMutationResult<void, Error, DeleteFollowUserRequest> => {
    const { data: authIdentity } = useAuthIdentity();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [MutationKey.DELETE_FOLLOW_USER],
        mutationFn: (input: DeleteFollowUserRequest) => deleteFollowUser(authIdentity?.id, input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [QueryKey.GET_FOLLOW_USER],
                type: 'all',
                exact: false,
            });
        }
    })
}
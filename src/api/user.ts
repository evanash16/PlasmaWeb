import qs from 'qs';

import {SearchUsersRequest, SearchUsersResponse} from "../types/user";
import {InfiniteData, useInfiniteQuery, UseInfiniteQueryResult} from "@tanstack/react-query";
import {QueryKey} from "../constant/query";
import {baseUrl} from "../constant/api";


const searchUsers = async (input: SearchUsersRequest): Promise<SearchUsersResponse> => {
    const query = qs.stringify(input, {
        skipNulls: true
    });
    const res = await fetch(`${baseUrl}/user?${query}`);
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
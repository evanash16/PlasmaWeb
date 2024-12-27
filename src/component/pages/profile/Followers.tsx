import {useListFollowUsers} from "../../../api/follow";
import {Follow, FollowsSortOrder, ListFollowsResponse} from "../../../types/follow";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {ListPostsResponse, Post} from "../../../types/post";
import flow from "lodash/flow";
import {map} from "lodash/fp";
import flatten from "lodash/fp/flatten";
import User from "../../common/User";
import {
    Container,
    ExpandableSection,
    Header,
    Pagination,
    PaginationProps,
    Spinner
} from "@cloudscape-design/components";
import {NonCancelableCustomEvent} from "@cloudscape-design/components/internal/events";


interface FollowersProps {
    userId: string;
    maxPageSize?: number;
}

const Followers = ({userId, maxPageSize = 5}: FollowersProps) => {
    const [pageIndex, setPageIndex] = useState<number>(1);

    const {
        data: listFollowsResponse,
        isLoading: isListFollowsLoading,
        isFetching: isListFollowsFetching,
        hasNextPage: hasMoreFollows,
        fetchNextPage: fetchMoreFollows,
    } = useListFollowUsers({
        userId,
        maxPageSize,
        sortOrder: FollowsSortOrder.CREATION_TIME_DESCENDING
    });
    // Auto-paginate until there are no more results
    useEffect(() => {
        if (!isListFollowsLoading && !isListFollowsFetching && hasMoreFollows) {
            void fetchMoreFollows();
        }
    }, [hasMoreFollows, fetchMoreFollows, isListFollowsLoading, isListFollowsFetching]);

    const follows: Follow[] = useMemo(() =>
            flow(map<ListFollowsResponse, Follow[]>(({follows}) => follows), flatten)(listFollowsResponse?.pages),
        [listFollowsResponse]);

    const knownPages = Math.ceil(follows.length / maxPageSize);
    const updatePageIndex = useCallback(async ({detail}: NonCancelableCustomEvent<PaginationProps.ChangeDetail>) => {
        if (detail.currentPageIndex <= knownPages) {
            setPageIndex(detail.currentPageIndex);
        }
    }, [knownPages]);

    const followContainers = useMemo(() => follows.map(follow => (<User userId={follow.followeeId}/>)), [follows]);
    const followContainersPage = useMemo(() =>
            followContainers.slice(
                (pageIndex - 1) * maxPageSize,
                Math.min(pageIndex * maxPageSize, follows.length)
            ),
        [followContainers, follows.length, maxPageSize, pageIndex]);

    return (
        <ExpandableSection variant='container' headerText='Following'>
            {isListFollowsLoading && <Spinner size='large'/>}
            {!isListFollowsLoading && (
                follows.length > 0
                    ? (
                        <>
                            {followContainersPage}
                            {follows.length > 0 && (
                                <Pagination
                                    currentPageIndex={pageIndex}
                                    onChange={updatePageIndex}
                                    openEnd
                                    pagesCount={knownPages}
                                />
                            )}
                        </>
                    )
                    : (
                        <i>No followers to show. :(</i>
                    )
            )}
        </ExpandableSection>
    );
}

export default Followers;
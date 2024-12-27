import {useGetUser} from "../../api/user";
import {useCreateFollowUser, useDeleteFollowUser, useGetFollowUser} from "../../api/follow";
import React, {useCallback, useMemo} from "react";
import {Button, Link, SpaceBetween, Spinner, TextContent} from "@cloudscape-design/components";
import {useAuthIdentity} from "../../api/auth";


interface UserProps {
    userId: string;
}

const User = ({userId}: UserProps) => {
    const {data: authIdentity} = useAuthIdentity();
    const isProfileOwner = userId === authIdentity?.userId;

    const {data: getUserResponse, isLoading: isGetUserLoading} = useGetUser({
        id: userId,
    });
    const {isSuccess: isFollowingUser, isLoading: isGetFollowUserLoading} = useGetFollowUser({
        userId: userId ?? ''
    });

    const {mutate: createFollowUser, isPending: isCreateFollowUserPending} = useCreateFollowUser();
    const {mutate: deleteFollowUser, isPending: isDeleteFollowUserPending} = useDeleteFollowUser();
    const onFollowClick = useCallback(() => {
        if (isFollowingUser) {
            deleteFollowUser({
                userId: userId ?? ''
            });
        } else {
            createFollowUser({
                userId: userId ?? ''
            });
        }
    }, [createFollowUser, deleteFollowUser, isFollowingUser, userId]);
    const isFollowPending = useMemo(() => isCreateFollowUserPending || isDeleteFollowUserPending, [isCreateFollowUserPending, isDeleteFollowUserPending]);

    return (
        <SpaceBetween direction='horizontal' size='xs'>
            {isGetUserLoading && <Spinner/>}
            {getUserResponse &&
                <TextContent>
                    <Link href={`/profile/${userId}`}>
                        <h3>{getUserResponse?.username}</h3>
                    </Link>
                </TextContent>
            }
            {!isProfileOwner && (
                <Button onClick={onFollowClick}>
                    {isFollowingUser ? 'Following' : 'Follow'}
                    {(isGetFollowUserLoading || isFollowPending) && <Spinner/>}
                </Button>
            )}
        </SpaceBetween>
    );
}

export default User;
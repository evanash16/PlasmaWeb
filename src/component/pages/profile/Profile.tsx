import React, {useCallback, useMemo} from "react";
import ManagePost from "../../common/ManagePost";
import {Box, Button, Container, Grid, Header, SpaceBetween, Spinner} from "@cloudscape-design/components";
import {useAuthIdentity} from "../../../api/auth";
import PostStack from "../../common/PostStack";
import {useProfileParams} from "../../../util/url";
import {useGetUser} from "../../../api/user";
import {useCreateFollowUser, useDeleteFollowUser, useGetFollowUser} from "../../../api/follow";
import Followers from "./Followers";

const Profile = () => {
    const {id} = useProfileParams();
    const {data: authIdentity} = useAuthIdentity();
    const userId: string | undefined = id ?? authIdentity?.userId;
    const isProfileOwner = userId === authIdentity?.userId;

    const {data: getUserResponse, isLoading: isGetUserLoading} = useGetUser({
        id: userId ?? ''
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
        <Box padding='xs'>
            <Grid gridDefinition={[{offset: 3, colspan: 6}]}>
                <SpaceBetween size='xs'>
                    {!isProfileOwner && (
                        <Header
                            actions={(
                                <Button onClick={onFollowClick}>
                                    {isFollowingUser ? 'Following' : 'Follow'}
                                    {(isGetFollowUserLoading || isFollowPending) && <Spinner/>}
                                </Button>
                            )}
                        >
                            {getUserResponse && getUserResponse.username}
                            {isGetUserLoading && <Spinner/>}
                        </Header>
                    )}
                    {isProfileOwner && (
                        <Container>
                            <ManagePost operation='create'/>
                        </Container>
                    )}
                    {userId && <Followers userId={userId}/>}
                    {userId && <PostStack postedById={userId}/>}
                </SpaceBetween>
            </Grid>
        </Box>
    )
}

export default Profile;
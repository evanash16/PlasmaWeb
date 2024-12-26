import React, {useEffect, useState} from "react";
import {Post} from "../../types/post";
import {
    Box,
    Button,
    Container,
    Header,
    Link,
    Modal,
    SpaceBetween,
    Spinner,
    TextContent
} from "@cloudscape-design/components";
import {useGetUser} from "../../api/user";
import dayjs from "dayjs";
import ManagePost from "./ManagePost";
import {useDeletePost} from "../../api/post";
import {useAuthIdentity} from "../../api/auth";

interface PostProps {
    post: Post;
    readOnly?: boolean;
}

const PostContainer = ({post, readOnly: readOnlyOverride}: PostProps) => {
    const {postedById, creationTime, lastModificationTime, title, body} = post;
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const wasEdited = lastModificationTime !== creationTime;

    const {data: authIdentity} = useAuthIdentity();
    const readOnly = readOnlyOverride || postedById !== authIdentity?.userId;

    const {
        mutate: deletePost,
        isPending: isDeletePostPending,
        isSuccess: isDeletePostSuccess,
        reset: resetDeletePost
    } = useDeletePost(post.id);
    useEffect(() => {
        if (isDeletePostSuccess) {
            setIsDeleting(false);
            resetDeletePost();
        }
    }, [isDeletePostSuccess, resetDeletePost]);

    const {data: getUserResponse, isLoading: isGetUserLoading} = useGetUser({
        id: postedById
    });
    const postedByUser = getUserResponse?.username;

    return (
        <Container>
            <SpaceBetween direction='horizontal' size='xs'>
                {isGetUserLoading && <Spinner/>}
                {postedByUser && <TextContent>
                    <Link href={`/profile/${postedById}`} target='_blank'>{postedByUser}</Link>
                </TextContent>}
                <TextContent>•</TextContent>
                <TextContent>{dayjs.unix(creationTime).local().format('L LT')}</TextContent>
                <TextContent>{wasEdited && (<i>(edited)</i>)}</TextContent>
            </SpaceBetween>
            {isEditing && !readOnly && (
                <ManagePost
                    showHeader={false}
                    operation='update'
                    post={post}
                    onCancel={() => setIsEditing(false)}
                    onSuccess={() => setIsEditing(false)}
                />
            )}
            {(isDeleting || isDeletePostPending) && (
                <Modal
                    onDismiss={() => setIsDeleting(false)}
                    visible={isDeleting || isDeletePostPending}
                    footer={
                        <Box float="right">
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button variant="link" onClick={() => setIsDeleting(false)}>Cancel</Button>
                                <Button variant="primary" onClick={() => deletePost()}>
                                    Delete
                                    {isDeletePostPending && <Spinner/>}
                                </Button>
                            </SpaceBetween>
                        </Box>
                    }
                    header="Delete post?"
                >
                    <PostContainer post={post} readOnly={true}/>
                </Modal>
            )}
            {(!isEditing || readOnly) && (
                <>
                    <Header
                        actions={!readOnly && (
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button
                                    variant='icon'
                                    iconName='edit'
                                    onClick={() => setIsEditing(true)}
                                >Edit</Button>
                                <Button
                                    variant='icon'
                                    iconName='remove'
                                    onClick={() => setIsDeleting(true)}
                                >Delete</Button>
                            </SpaceBetween>
                        )}
                    >{title}</Header>
                    {body && <TextContent>{body}</TextContent>}
                </>
            )}
        </Container>
    );
}

export default PostContainer;
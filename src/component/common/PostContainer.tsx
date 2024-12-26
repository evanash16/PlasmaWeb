import React, {useState} from "react";
import {Post} from "../../types/post";
import {Box, Button, Container, Header, Link, SpaceBetween, Spinner, TextContent} from "@cloudscape-design/components";
import {useGetUser} from "../../api/user";
import dayjs from "dayjs";
import ManagePost from "./ManagePost";

interface PostProps {
    post: Post;
    readOnly?: boolean;
}

const PostContainer = ({post, readOnly}: PostProps) => {
    const {postedById, creationTime, lastModificationTime, title, body} = post;
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const wasEdited = lastModificationTime !== creationTime;

    const {data: getUserResponse, isLoading: isGetUserLoading} = useGetUser({
        id: postedById
    });
    const postedByUser = getUserResponse?.username;

    return (
        <Box margin='xs'>
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
                {(!isEditing || readOnly) && (
                    <>
                        <Header
                            actions={!readOnly && (
                                <SpaceBetween direction="horizontal" size="xs">
                                    <Button variant='icon' iconName='edit' onClick={() => setIsEditing(true)}>Edit</Button>
                                    <Button variant='icon' iconName='remove'>Delete</Button>
                                </SpaceBetween>
                            )}
                        >{title}</Header>
                        {body && <TextContent>{body}</TextContent>}
                    </>
                )}
            </Container>
        </Box>
    );
}

export default PostContainer;
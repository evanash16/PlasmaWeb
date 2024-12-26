import React from "react";
import {Post} from "../../types/post";
import {Box, Container, Header, Link, SpaceBetween, Spinner, TextContent} from "@cloudscape-design/components";
import {useGetUser} from "../../api/user";
import dayjs from "dayjs";

interface PostProps {
    post: Post;
    readOnly?: boolean;
}

const PostContainer = ({ post }: PostProps) => {
    const { postedById, creationTime, lastModificationTime, title, body } = post;

    const { data: getUserResponse, isLoading: isGetUserLoading } = useGetUser({
        id: postedById
    });
    const postedByUser = getUserResponse?.username;

    const wasEdited = lastModificationTime !== creationTime;

    return (
        <Box margin='xs'>
            <Container>
                <SpaceBetween direction='horizontal' size='xs'>
                    {isGetUserLoading && <Spinner />}
                    {postedByUser &&
                        <Link href='#' target='_blank'>{postedByUser}</Link>
                    }
                    <TextContent>
                        •
                    </TextContent>
                    <TextContent>
                        {dayjs.unix(creationTime).local().format('L LT')}
                    </TextContent>
                    <TextContent>
                        {wasEdited && (<i>(edited)</i>)}
                    </TextContent>
                </SpaceBetween>
                <Header>{title}</Header>
                {body && <TextContent>{body}</TextContent>}
            </Container>
        </Box>
    );
}

export default PostContainer;
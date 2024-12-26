import React from "react";
import CreatePost from "./CreatePost";
import {Box, Container, Grid} from "@cloudscape-design/components";
import {useAuthIdentity} from "../../../api/auth";
import Posts from "../../common/Posts";

const Profile = () => {
    const { data: authIdentity } = useAuthIdentity();
    const userId: string | undefined = authIdentity?.userId;

    return (
        <Box padding='xs'>
            <Grid gridDefinition={[ { offset: 3, colspan: 6 }]}>
                <Box>
                    <Container>
                        <CreatePost/>
                    </Container>
                    {userId &&
                        <Posts postedById={userId}></Posts>
                    }
                </Box>
            </Grid>
        </Box>
    )
}

export default Profile;
import React from "react";
import ManagePost from "../../common/ManagePost";
import {Box, Container, Grid} from "@cloudscape-design/components";
import {useAuthIdentity} from "../../../api/auth";
import UserPosts from "../../common/UserPosts";
import {useProfileParams} from "../../../util/url";

const Profile = () => {
    const {id} = useProfileParams();
    const {data: authIdentity} = useAuthIdentity();
    const userId: string | undefined = id ?? authIdentity?.userId;
    const readOnly = userId !== authIdentity?.userId;

    return (
        <Box padding='xs'>
            <Grid gridDefinition={[{offset: 3, colspan: 6}]}>
                <Box>
                    {!readOnly && (
                        <Container>
                            <ManagePost operation='create'/>
                        </Container>
                    )}
                    {userId &&
                        <UserPosts
                            postedById={userId}
                            readOnly={readOnly}
                        />
                    }
                </Box>
            </Grid>
        </Box>
    )
}

export default Profile;
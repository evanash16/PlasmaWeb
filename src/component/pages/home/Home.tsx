import React from "react";
import {Box, Grid} from "@cloudscape-design/components";
import PostStack from "../../common/PostStack";

const Home = () => {
    return (
        <Box padding='xs'>
            <Grid gridDefinition={[{offset: 3, colspan: 6}]}>
                <PostStack/>
            </Grid>
        </Box>
    )
}

export default Home;
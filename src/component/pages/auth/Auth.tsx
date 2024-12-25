import * as React from "react";
import {Box, Container, Grid, Header, Icon, SpaceBetween, TextContent} from "@cloudscape-design/components";
import CreateOrLogin from "./CreateOrLogin";
import {useState} from "react";
import Create from "./Create";
import Login from "./Login";

export enum AuthType {
    LOGIN,
    CREATE
}

interface AuthProps {
    type?: AuthType
}

const Auth = ({type}: AuthProps) => {
    const [username, setUsername] = useState<string>('');

    return (
        <Grid gridDefinition={[{colspan: 4, offset: 4}]}>
            <SpaceBetween size="xxs">
                <Box textAlign='center' padding='s'>
                    <Icon url='/plasma-ball-plasma-svgrepo-com.svg' size='large'/>
                </Box>
                <Box>
                    <Container>
                        <form onSubmit={e => e.preventDefault()}>
                            {type === undefined && (
                                <CreateOrLogin
                                    username={username}
                                    setUsername={setUsername}
                                />
                            )}
                            {type === AuthType.CREATE && (<Create username={username}/>)}
                            {type === AuthType.LOGIN && (<Login username={username}/>)}
                        </form>
                    </Container>
                </Box>
            </SpaceBetween>
        </Grid>
    );
}

export default Auth;
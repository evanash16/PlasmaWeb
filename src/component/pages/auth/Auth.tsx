import React, {useEffect, useState} from "react";
import {Box, Container, Grid, Icon, SpaceBetween} from "@cloudscape-design/components";
import CreateOrLogin from "./CreateOrLogin";
import Create from "./Create";
import Login from "./Login";
import {SESSION_ID_COOKIE} from "../../../constant/cookie";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router";

export enum AuthType {
    LOGIN,
    CREATE
}

interface AuthProps {
    type?: AuthType
}

const Auth = ({type}: AuthProps) => {
    const [username, setUsername] = useState<string>('');
    const [cookies] = useCookies([SESSION_ID_COOKIE]);
    const navigate = useNavigate();

    const sessionIdCookie: string | undefined = cookies[SESSION_ID_COOKIE];
    useEffect(() => {
        if (sessionIdCookie) {
            navigate('/');
        }
    }, [navigate, sessionIdCookie]);

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
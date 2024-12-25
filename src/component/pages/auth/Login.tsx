import {Header, SpaceBetween } from "@cloudscape-design/components";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import * as React from "react";
import Button from "@cloudscape-design/components/button";
import Form from "@cloudscape-design/components/form";
import {useCallback, useState} from "react";
import {authLogin} from "../../../api/auth";
import {AuthLoginResponse} from "../../../types/auth";
import {useCookies} from "react-cookie";
import {SESSION_ID_COOKIE} from "../../../constant/cookie";
import {useNavigate} from "react-router";

export interface LoginProps {
    username: string;
}

const Login = ({ username }: LoginProps) => {
    const [password, setPassword] = useState<string>("");
    const [, setCookie,] = useCookies([SESSION_ID_COOKIE]);

    const navigate = useNavigate();

    const onSubmitClick = useCallback(() => {
        authLogin({ username, password })
            .then(({ id: sessionId }: AuthLoginResponse) => setCookie(SESSION_ID_COOKIE, sessionId))
            .then(() => navigate('/'));
    }, [username, password, setCookie, navigate]);

    return (
        <Form
            actions={
                <SpaceBetween direction="horizontal" size="xs">
                    <Button variant="primary" disabled={!password} onClick={onSubmitClick}>Submit</Button>
                </SpaceBetween>
            }
            header={<Header variant="h1">Login</Header>}
        >
            <SpaceBetween direction="vertical" size="l">
                <FormField label="Username">
                    <Input value={username} disabled={true}/>
                </FormField>
                <FormField label="Password">
                    <Input
                        value={password}
                        onChange={({ detail }) => setPassword(detail.value)}
                        type='password'
                    />
                </FormField>
            </SpaceBetween>
        </Form>
    )
}

export default Login;

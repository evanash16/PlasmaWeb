import {Header, SpaceBetween } from "@cloudscape-design/components";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import * as React from "react";
import Button from "@cloudscape-design/components/button";
import Form from "@cloudscape-design/components/form";
import {useState} from "react";

export interface LoginProps {
    username: string;
}

const Login = ({ username }: LoginProps) => {
    const [password, setPassword] = useState<string>("");

    return (
        <Form
            actions={
                <SpaceBetween direction="horizontal" size="xs">
                    <Button variant="primary">Submit</Button>
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

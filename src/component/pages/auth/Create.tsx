import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    Button,
    Form,
    FormField,
    Header,
    Input,
    SpaceBetween,
    Spinner
} from "@cloudscape-design/components";
import {useCreateUser} from "../../../api/user";
import {useNavigate} from "react-router";

export interface CreateProps {
    username: string;
}

const Create = ({ username }: CreateProps) => {
    const [password, setPassword] = useState<string>("");
    const [confirmedPassword, setConfirmedPassword] = useState<string>("");

    const navigate = useNavigate();

    const isConfirmedPasswordIdentical = useMemo(() => confirmedPassword === password, [confirmedPassword, password]);
    const isValidForm = useMemo(() => isConfirmedPasswordIdentical, [isConfirmedPasswordIdentical]);

    const { mutate: createUser, isPending: isCreateUserLoading, isSuccess: isCreateUserSuccess } = useCreateUser();
    const onSubmitClick = useCallback(() => {
        createUser({ username, password });
    }, [createUser, username, password]);

    useEffect(() => {
        if (isCreateUserSuccess) {
            navigate('/auth/login');
        }
    }, [isCreateUserSuccess, navigate]);

    return (
        <Form
            actions={
                <SpaceBetween direction="horizontal" size="xs">
                    <Button variant="primary" onClick={onSubmitClick} disabled={!isValidForm}>Submit</Button>
                    {isCreateUserLoading && <Spinner />}
                </SpaceBetween>
            }
            header={<Header variant="h1">Create Account</Header>}
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
                <FormField label="Confirm password" errorText={isConfirmedPasswordIdentical ? '' : 'Passwords do not match'}>
                    <Input
                        value={confirmedPassword}
                        onChange={({ detail }) => setConfirmedPassword(detail.value)}
                        disabled={!password}
                        type='password'
                    />
                </FormField>
            </SpaceBetween>
        </Form>
    )
}

export default Create;
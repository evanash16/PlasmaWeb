import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Button,
    Form,
    FormField,
    Header,
    Input,
    SpaceBetween,
    Spinner} from "@cloudscape-design/components";
import {useNavigate} from "react-router";
import {useSearchUsers} from "../../../api/user";
import {SearchUsersResponse, User} from "../../../types/user";
import flow from "lodash/flow";
import {map} from "lodash/fp";
import flatten from "lodash/fp/flatten";

interface CreateOrLoginProps {
    username: string;

    setUsername: (newUsername: string) => void;
}

const CreateOrLogin = ({ username, setUsername }: CreateOrLoginProps) => {
    const [usernameSearchString, setUsernameSearchString] = useState<string>('');

    const navigate = useNavigate();
    const {
        data: searchUsersResponse,
        isLoading: isSearchUsersLoading,
    } = useSearchUsers({
        usernameSearchString,
        maxPageSize: 1
    });

    const users: User[] = useMemo(() =>
        flow(map<SearchUsersResponse, User[]>(({users}) => users), flatten)(searchUsersResponse?.pages),
        [searchUsersResponse]);

    const onNextClick = useCallback(() => setUsernameSearchString(username), [username]);
    useEffect(() => {
        if (usernameSearchString && !isSearchUsersLoading) {
            const shouldSignIn = users?.[0]?.username === username;
            if (shouldSignIn) {
                navigate("login");
            } else {
                navigate("create");
            }
        }
    }, [isSearchUsersLoading, navigate, users, username, usernameSearchString]);

    return (
        <Form
            actions={
                <SpaceBetween direction="horizontal" size="xs">
                    <Button variant="primary" onClick={onNextClick}>Next</Button>
                    {isSearchUsersLoading && <Spinner/>}
                </SpaceBetween>
            }
            header={<Header variant="h1">Login or Create Account</Header>}
        >
            <SpaceBetween direction="vertical" size="l">
                <FormField label="Username">
                    <Input
                        value={username}
                        onChange={({ detail }) => setUsername(detail.value)}
                    />
                </FormField>
            </SpaceBetween>

        </Form>
    )
}

export default CreateOrLogin;

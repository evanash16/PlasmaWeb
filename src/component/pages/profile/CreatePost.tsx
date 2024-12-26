import {
    Button,
    Form,
    FormField,
    Header,
    Input,
    SpaceBetween,
    Textarea
} from "@cloudscape-design/components";
import React, {useCallback, useState} from "react";
import {useCreatePost} from "../../../api/post";

const CreatePost = () => {
    const [title, setTitle] = useState<string>('');
    const [titleIsValid, setTitleIsValid] = useState<boolean>(true);
    const validateTitle = useCallback(() => setTitleIsValid(Boolean(title)), [title]);

    const [body, setBody] = useState<string | undefined>();
    const updateBody = useCallback((newBody: string) => {
        if (newBody === '') {
            setBody(undefined);
        }
        setBody(newBody);
    }, [setBody]);

    const { mutate: createPost } = useCreatePost();

    const onSubmitClick = useCallback(() => {
        createPost({ title, body });
        setTitle('');
        setBody(undefined);
    }, [createPost, title, body])

    return (
        <form onSubmit={e => e.preventDefault()}>
            <Form
                actions={
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button variant="primary" onClick={onSubmitClick}>Post</Button>
                    </SpaceBetween>
                }
                header={<Header variant="h1">Create Post</Header>}
            >
                <SpaceBetween direction="vertical" size="l">
                    <FormField label="Title" errorText={!titleIsValid ? 'You must provide a title' : ''}>
                        <Input
                            value={title ?? ''}
                            onBlur={() => validateTitle()}
                            onChange={({detail}) => setTitle(detail.value)}
                        />
                    </FormField>
                    <FormField label="Body">
                        <Textarea value={body ?? ''} onChange={({detail}) => updateBody(detail.value)}/>
                    </FormField>
                </SpaceBetween>
            </Form>
        </form>
    );
}

export default CreatePost;
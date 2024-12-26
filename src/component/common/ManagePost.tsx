import {
    Button,
    Form,
    FormField,
    Header,
    Input,
    SpaceBetween, Spinner,
    Textarea
} from "@cloudscape-design/components";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useCreatePost, useUpdatePost} from "../../api/post";
import {Post} from "../../types/post";
import {upperFirst} from "lodash";

type Operation = 'create' | 'update';

export interface ManagePostProps {
    showHeader?: boolean;
    post?: Partial<Post>;
    operation: Operation;
    onCancel?: () => void;
    onSuccess?: () => void;
}

const submitButtonTextByOperation: Record<Operation, string> = {
    create: 'Post',
    update: 'Save'
}

const ManagePost = ({showHeader = true, post, operation, onCancel, onSuccess}: ManagePostProps) => {
    const [title, setTitle] = useState<string>(post?.title ?? '');
    const [titleIsValid, setTitleIsValid] = useState<boolean>(true);
    const validateTitle = useCallback(() => setTitleIsValid(Boolean(title)), [title]);

    const [body, setBody] = useState<string | undefined>(post?.body ?? '');
    const updateBody = useCallback((newBody: string) => {
        if (newBody === '') {
            setBody(undefined);
        }
        setBody(newBody);
    }, [setBody]);

    const {
        mutate: createPost,
        isSuccess: isCreatePostSuccess,
        isPending: isCreatePostPending,
        reset: resetCreatePost
    } = useCreatePost();
    const {
        mutate: updatePost,
        isSuccess: isUpdatePostSuccess,
        isPending: isUpdatePostPending,
        reset: resetUpdatePost
    } = useUpdatePost(post?.id ?? '');
    const isModifyPending = useMemo(
        () => isCreatePostPending || isUpdatePostPending,
        [isCreatePostPending, isUpdatePostPending]
    );
    useEffect(() => {
        if (operation === 'create' && isCreatePostSuccess) {
            onSuccess?.();
            resetCreatePost();
        } else if (operation === 'update' && isUpdatePostSuccess) {
            onSuccess?.();
            resetUpdatePost();
        }
    }, [isCreatePostSuccess, isUpdatePostSuccess, onSuccess, operation, resetCreatePost, resetUpdatePost]);

    const onSubmitClick = useCallback(() => {
        switch (operation) {
            case 'create':
                createPost({title, body});
                setTitle('');
                setBody(undefined);
                break;
            case 'update':
                updatePost({
                    title,
                    body: {
                        isRemove: !Boolean(body),
                        value: body
                    }
                });
                break;
        }
    }, [operation, createPost, title, body, updatePost])

    return (
        <form onSubmit={e => e.preventDefault()}>
            <Form
                actions={
                    <SpaceBetween direction="horizontal" size="xs">
                        {onCancel && <Button onClick={() => onCancel()}>Cancel</Button>}
                        <Button
                            variant="primary"
                            onClick={onSubmitClick}
                        >
                            {submitButtonTextByOperation[operation]}
                            {isModifyPending && <Spinner/>}
                        </Button>
                    </SpaceBetween>
                }
                header={showHeader && <Header variant="h1">{upperFirst(operation)} Post</Header>}
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

export default ManagePost;
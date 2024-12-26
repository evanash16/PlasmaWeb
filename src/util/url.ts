import {useMatch} from "react-router";

interface ProfileParams {
    id?: string;
}

export const useProfileParams = (): ProfileParams => {
    const routeMatch = useMatch('/profile/:id');
    return (routeMatch?.params ?? {}) as ProfileParams;
}
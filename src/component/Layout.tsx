import TopNavigation from "@cloudscape-design/components/top-navigation";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Outlet, useNavigate} from "react-router";
import {useCookies} from "react-cookie";
import {SESSION_ID_COOKIE} from "../constant/cookie";
import {useAuthIdentity} from "../api/auth";
import {useGetUser, useSearchUsers} from "../api/user";
import {Autosuggest, AutosuggestProps, ButtonDropdownProps} from "@cloudscape-design/components";
import '../dayjs';
import dayjs from 'dayjs';
import {SearchUsersResponse, User} from "../types/user";
import {flow} from "lodash";
import {flatten, map} from "lodash/fp";
import {NonCancelableCustomEvent} from "@cloudscape-design/components/internal/events";

const Layout = () => {
    const [usernameSearchString, setUsernameSearchString] = useState<string>('');
    const [cookies, , deleteCookie] = useCookies([SESSION_ID_COOKIE]);
    const navigate = useNavigate();

    const {
        data: searchUsersResponse,
    } = useSearchUsers({
        usernameSearchString,
        maxPageSize: 10
    });
    const users: User[] = useMemo(() =>
            flow(map<SearchUsersResponse, User[]>(({users}) => users), flatten)(searchUsersResponse?.pages),
        [searchUsersResponse]);
    const autosuggestUserOptions: AutosuggestProps.Option[] = useMemo(() => {
        return users.map(({ id, username }) => ({ value: id, label: username }));
    }, [users]);
    const useSelectOption = useCallback(({ detail }: NonCancelableCustomEvent<AutosuggestProps.SelectDetail>) => {
        setUsernameSearchString('');
        navigate(`/profile/${detail.value}`);
    }, [navigate]);

    const sessionIdCookie: string | undefined = cookies[SESSION_ID_COOKIE];
    useEffect(() => {
        if (!sessionIdCookie) {
            navigate('/auth');
        }
    }, [navigate, sessionIdCookie]);

    const {data: authIdentity} = useAuthIdentity();
    const {data: getUserResponse} = useGetUser({
        id: authIdentity?.userId ?? ''
    });
    const memberSinceFormattedDate: string | undefined = useMemo(() => {
        if (getUserResponse?.creationTime) {
            return dayjs.unix(getUserResponse?.creationTime).format('L');
        }
    }, [getUserResponse?.creationTime]);

    const signOutId = 'sign-out';
    const profileId = 'profile';
    const onDropdownItemClick = useCallback((event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => {
        switch (event.detail.id) {
            case signOutId:
                deleteCookie(SESSION_ID_COOKIE);
                break;
            case profileId:
                navigate('profile');
                break;
        }
    }, [deleteCookie, navigate]);

    return (
        <div>
            <TopNavigation
                identity={{
                    href: "/",
                    title: "Plasma",
                    logo: {
                        src: "/plasma-ball-plasma-svgrepo-com.svg",
                    }
                }}
                utilities={[
                    {
                        type: "menu-dropdown",
                        text: getUserResponse?.username,
                        description: `Member since ${memberSinceFormattedDate}`,
                        iconName: "user-profile",
                        onItemClick: onDropdownItemClick,
                        items: [
                            {iconName: 'user-profile', id: profileId, text: "Profile"},
                            {id: signOutId, text: "Sign out"}
                        ]
                    }
                ]}
                search={<Autosuggest
                    value={usernameSearchString ?? ''}
                    onChange={({detail}) => setUsernameSearchString(detail.value)}
                    options={autosuggestUserOptions}
                    onSelect={useSelectOption}
                />}
            />
            <Outlet/>
        </div>
    );
}

export default Layout;

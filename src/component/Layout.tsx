import TopNavigation from "@cloudscape-design/components/top-navigation";
import React, {useCallback, useEffect, useMemo} from "react";
import {Outlet, useNavigate} from "react-router";
import {useCookies} from "react-cookie";
import {SESSION_ID_COOKIE} from "../constant/cookie";
import {useAuthIdentity} from "../api/auth";
import {useGetUser} from "../api/user";
import {ButtonDropdownProps} from "@cloudscape-design/components";
import '../dayjs';
import dayjs from 'dayjs';

const Layout = () => {
    const [cookies, , deleteCookie] = useCookies([SESSION_ID_COOKIE]);
    const navigate = useNavigate();

    const sessionIdCookie: string | undefined = cookies[SESSION_ID_COOKIE];
    useEffect(() => {
        if (!sessionIdCookie) {
            navigate('/auth');
        }
    }, [navigate, sessionIdCookie]);

    const {data: authIdentity } = useAuthIdentity();
    const {data: getUserResponse } = useGetUser({
        id: authIdentity?.userId ?? ''
    });
    const memberSinceFormattedDate: string | undefined = useMemo(() => {
        if (getUserResponse?.creationTime) {
            return dayjs.unix(getUserResponse?.creationTime).format('L');
        }
    }, [getUserResponse?.creationTime]);

    const signOutId = 'sign-out';
    const onDropdownItemClick = useCallback((event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => {
        switch (event.detail.id) {
            case signOutId:
                deleteCookie(SESSION_ID_COOKIE);
                break;
        }
    }, [deleteCookie]);

    return (
        <div>
            <TopNavigation
                identity={{
                    href: "#",
                    title: "Plasma",
                    logo: {
                        src: "/plasma-ball-plasma-svgrepo-com.svg",
                        alt: "Plasma"
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
                            {id: signOutId, text: "Sign out"}
                        ]
                    }
                ]}/>
            <Outlet/>
        </div>
    );
}

export default Layout;

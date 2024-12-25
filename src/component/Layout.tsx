import TopNavigation from "@cloudscape-design/components/top-navigation";
import React, {useEffect} from "react";
import {Outlet, useNavigate} from "react-router";
import {useCookies} from "react-cookie";
import {SESSION_ID_COOKIE} from "../constant/cookie";

const Layout = () => {
    const [cookies] = useCookies([SESSION_ID_COOKIE]);
    const navigate = useNavigate();

    const sessionIdCookie: string | undefined = cookies[SESSION_ID_COOKIE];
    useEffect(() => {
        if (!sessionIdCookie) {
            navigate('/auth');
        }
    }, [navigate, sessionIdCookie]);

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
                }}/>
            <Outlet/>
        </div>
    );
}

export default Layout;

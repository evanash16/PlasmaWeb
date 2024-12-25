import TopNavigation from "@cloudscape-design/components/top-navigation";
import React from "react";
import {Outlet} from "react-router";

const Layout = () => {
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

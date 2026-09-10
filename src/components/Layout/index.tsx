import React, { useState } from "react";

import { Grid, Overlay } from "./style";

import MainHeader from "../MainHeader";
import Aside from "../Aside";
import Content from "../Content";

interface LayoutProps {
children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
const [menuIsOpen, setMenuIsOpen] = useState(false);


const toggleMenu = () => {
    setMenuIsOpen((previousState) => !previousState);
};

const closeMenu = () => {
    setMenuIsOpen(false);
};

return (
    <Grid>
        <MainHeader
            onMenuClick={toggleMenu}
        />

        <Aside
            menuIsOpen={menuIsOpen}
            onMenuClose={closeMenu}
        />

        <Content>
            {children}
        </Content>

        {menuIsOpen && (
            <Overlay
                onClick={closeMenu}
            />
        )}
    </Grid>
);

};

export default Layout;

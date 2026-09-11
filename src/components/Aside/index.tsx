import React from "react";

import {
    useHistory,
} from "react-router-dom";

import {
    Container,
    Header,
    LogImg,
    Title,
    MenuContainer,
    MenuItemLink,
    LogoutButton,
    CloseButton
} from "./style";

import {
    MdDashboard,
    MdArrowDownward,
    MdArrowUpward,
    MdExitToApp,
    MdClose
} from "react-icons/md";

import logImg from "../../assets/logo.svg";

import { useAuth } from "../../Hooks/auth";

interface AsideProps {
    menuIsOpen: boolean;
    onMenuClose: () => void;
}

const Aside: React.FC<AsideProps> = ({
    menuIsOpen,
    onMenuClose
}) => {
    const history = useHistory();
    const { logout } = useAuth();

    const handleLogout = () => {
        onMenuClose();
        logout();
        history.push("/login");
    };

    return (
        <Container menuIsOpen={menuIsOpen}>
            <Header>
                <LogImg
                    src={logImg}
                    alt="Logo Minha Carteira"
                />

                <Title>
                    Minha Carteira
                </Title>

                <CloseButton
                    type="button"
                    onClick={onMenuClose}
                >
                    <MdClose />
                </CloseButton>
            </Header>

            <MenuContainer>
                <MenuItemLink
                    href="/"
                    onClick={onMenuClose}
                >
                    <MdDashboard />
                    Dashboard
                </MenuItemLink>

                <MenuItemLink
                    href="/list/entry-balance"
                    onClick={onMenuClose}
                >
                    <MdArrowUpward />
                    Entradas
                </MenuItemLink>

                <MenuItemLink
                    href="/list/exit-balance"
                    onClick={onMenuClose}
                >
                    <MdArrowDownward />
                    Saídas
                </MenuItemLink>

                <LogoutButton
                    type="button"
                    onClick={handleLogout}
                >
                    <MdExitToApp />
                    Sair
                </LogoutButton>
            </MenuContainer>
        </Container>
    );
};

export default Aside;
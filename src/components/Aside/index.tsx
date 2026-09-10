import React from "react";

import {
    Container,
    Header,
    LogImg,
    Title,
    MenuContainer,
    MenuItemLink,
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

interface AsideProps {
    menuIsOpen: boolean;
    onMenuClose: () => void;
}

const Aside: React.FC<AsideProps> = ({
    menuIsOpen,
    onMenuClose
}) => {
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

                <MenuItemLink
                    href="#"
                    onClick={onMenuClose}
                >
                    <MdExitToApp />
                    Sair
                </MenuItemLink>
            </MenuContainer>
        </Container>
    );
};

export default Aside;
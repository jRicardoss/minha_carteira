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
    DangerButton,
    CloseButton
} from "./style";

import {
    MdDashboard,
    MdArrowDownward,
    MdArrowUpward,
    MdExitToApp,
    MdDeleteForever,
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
    const { logout, excluirConta } = useAuth();

    const handleLogout = () => {
        onMenuClose();
        logout();
        history.push("/login");
    };

    const handleExcluirConta = async () => {
        const confirmar = window.confirm(
            "Tem certeza? Isso vai apagar sua conta e todas as suas transações, sem volta."
        );

        if (!confirmar) return;

        try {
            onMenuClose();
            await excluirConta();
            history.push("/login");
        } catch (err) {
            alert("Erro ao excluir a conta. Tente novamente.");
        }
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

                <DangerButton
                    type="button"
                    onClick={handleExcluirConta}
                >
                    <MdDeleteForever />
                    Excluir conta
                </DangerButton>
            </MenuContainer>
        </Container>
    );
};

export default Aside;
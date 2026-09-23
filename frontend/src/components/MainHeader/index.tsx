import React, { useMemo } from "react";

import {
    Container,
    MenuButton,
    Profile,
    Welcome,
    UserName,
} from "./style";

import { MdMenu } from "react-icons/md";

import emojis from "../../utils/emojis";

import ModalAddTransaction from "../ModalAddTransaction";

import { useAuth } from "../../Hooks/auth";

interface MainHeaderProps {
    onMenuClick: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({
    onMenuClick,
}) => {

    const emoji = useMemo(() => {
        const indice = Math.floor(
            Math.random() * emojis.length
        );

        return emojis[indice];
    }, []);

    const {
        usuario,
    } = useAuth();

    return (
        <Container>

            <MenuButton
                type="button"
                onClick={onMenuClick}
                aria-label="Abrir menu"
            >
                <MdMenu />
            </MenuButton>

            <Profile>

                <Welcome>
                    Olá, {emoji}
                </Welcome>

                <UserName>
                    {usuario?.nome}
                </UserName>

            </Profile>

            <ModalAddTransaction />

        </Container>
    );
};

export default MainHeader;
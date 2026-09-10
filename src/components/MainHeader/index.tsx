import React, { useMemo } from "react";

import {
    Container,
    MenuButton,
    Profile,
    Welcome,
    UserName
} from "./style";

import { MdMenu } from "react-icons/md";

import emojis from "../../utils/emojis";
import ModalAddTransaction from "../ModalAddTransaction";

interface MainHeaderProps {
    onMenuClick: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({
    onMenuClick
}) => {
    const emoji = useMemo(() => {
        const indice = Math.floor(
            Math.random() * emojis.length
        );

        return emojis[indice];
    }, []);

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
                    João Ricardo
                </UserName>
            </Profile>

            <ModalAddTransaction />
        </Container>
    );
};

export default MainHeader;
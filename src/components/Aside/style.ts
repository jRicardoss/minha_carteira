import styled from "styled-components";

interface ContainerProps {
    menuIsOpen: boolean;
}

export const Container = styled.aside<ContainerProps>`
    grid-area: AS;

    background-color: ${props => props.theme.color.secondary};

    padding-left: 20px;

    border-right: 1px solid
        ${props => props.theme.color.gray};

    z-index: 100;

    @media (max-width: 768px) {
        position: fixed;

        top: 0;
        left: 0;

        width: 250px;
        height: 100vh;

        transform: translateX(
            ${props => props.menuIsOpen ? "0" : "-100%"}
        );

        transition: transform 0.3s ease;

        box-shadow: ${props =>
            props.menuIsOpen
                ? "4px 0 15px rgba(0, 0, 0, 0.3)"
                : "none"
        };

        border-right: none;
    }
`;

export const Header = styled.header`
    display: flex;
    align-items: center;

    height: 70px;
`;

export const LogImg = styled.img`
    height: 40px;
    width: 40px;
`;

export const Title = styled.h3`
    color: ${props => props.theme.color.white};

    margin-left: 10px;
`;

export const CloseButton = styled.button`
    display: none;

    background: transparent;
    border: none;

    color: ${props => props.theme.color.white};

    cursor: pointer;

    margin-left: auto;
    margin-right: 15px;

    > svg {
        font-size: 28px;
    }

    @media (max-width: 768px) {
        display: flex;

        align-items: center;
        justify-content: center;
    }
`;

export const MenuContainer = styled.nav`
    display: flex;
    flex-direction: column;

    margin-top: 50px;
`;

export const MenuItemLink = styled.a`
    color: ${props => props.theme.color.info};

    text-decoration: none;

    margin: 7px 0;

    display: flex;
    align-items: center;

    transition: opacity 0.3s;

    &:hover {
        opacity: 0.7;
    }

    > svg {
        font-size: 18px;
        margin-right: 5px;
    }
`;
export const LogoutButton = styled.button`
    color: ${props => props.theme.color.info};

    background: transparent;
    border: none;
    font-family: inherit;
    font-size: 16px;

    text-decoration: none;

    margin: 7px 0;
    padding: 0;

    display: flex;
    align-items: center;

    cursor: pointer;

    transition: opacity 0.3s;

    &:hover {
        opacity: 0.7;
    }

    > svg {
        font-size: 18px;
        margin-right: 5px;
    }
`;

export const DangerButton = styled.button`
    color: #E44C4E;

    background: transparent;
    border: none;
    font-family: inherit;
    font-size: 16px;

    margin: 7px 0;
    padding: 0;

    display: flex;
    align-items: center;

    cursor: pointer;

    transition: opacity 0.3s;

    &:hover {
        opacity: 0.7;
    }

    > svg {
        font-size: 18px;
        margin-right: 5px;
    }
`;
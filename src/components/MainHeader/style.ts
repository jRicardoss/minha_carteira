import styled from "styled-components";

export const Container = styled.div`

    grid-area: MH;

    background-color:
        ${props =>
            props.theme.color.secondary};

    display: flex;

    justify-content: flex-end;

    align-items: center;

    padding: 0 10px;

    border-bottom:
        1px solid
        ${props =>
            props.theme.color.gray};

    @media (max-width: 768px) {

        justify-content: flex-start;

    }

`;

export const MenuButton = styled.button`

    display: none;

    background: transparent;

    border: none;

    color:
        ${props =>
            props.theme.color.white};

    cursor: pointer;

    padding: 5px;

    margin-right: 15px;

    > svg {

        font-size: 30px;

    }

    @media (max-width: 768px) {

        display: flex;

        align-items: center;

        justify-content: center;

    }

`;

export const Profile = styled.div`

    color:
        ${props =>
            props.theme.color.white};

    margin-right: 15px;

    @media (max-width: 768px) {

        margin-left: auto;

    }

    @media (max-width: 480px) {

        margin-right: 8px;

    }

`;

export const Welcome = styled.h3`

    @media (max-width: 480px) {

        font-size: 14px;

    }

`;

export const UserName = styled.span`

    @media (max-width: 480px) {

        font-size: 13px;

    }

`;
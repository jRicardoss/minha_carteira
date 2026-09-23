import styled from "styled-components";

export const Container = styled.div`
    grid-area: CT;

    color: ${props => props.theme.color.white};

    background-color:
        ${props => props.theme.color.primary};

    padding: 25px;

    min-width: 0;

    overflow-y: auto;

    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background-color:
            ${props => props.theme.color.secondary};

        border-radius: 10px;
    }

    ::-webkit-scrollbar-track {
        background-color:
            ${props => props.theme.color.tertiary};
    }

    @media (max-width: 768px) {
        padding: 15px;
    }

    @media (max-width: 480px) {
        padding: 10px;
    }
`;
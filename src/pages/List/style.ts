import styled from "styled-components";

export const Container = styled.div``;

export const Content = styled.main``;

export const Filters = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 30px;

    .tag-filter {
        font-size: 18px;
        font-weight: 500;

        background: none;

        color: ${props => props.theme.color.white};

        margin: 0 10px;

        transition: opacity 0.3s;

        opacity: 0.4;

        &:hover {
            opacity: 0.7;
        }
    }

    .tag-filter-recurrent::after {
        content: "";

        display: block;

        width: 70px;

        margin: 0 auto;

        border-bottom: 10px solid
            ${props => props.theme.color.success};

        border-radius: 3px;
    }

    .tag-filter-eventual::after {
        content: "";

        display: block;

        width: 70px;

        margin: 0 auto;

        border-bottom: 10px solid
            ${props => props.theme.color.warning};

        border-radius: 3px;
    }

    .tag-actived {
        opacity: 1;
    }
`;

export const Overlay = styled.div`
    position: fixed;

    inset: 0;

    background: rgba(0, 0, 0, 0.6);

    backdrop-filter: blur(4px);

    display: flex;

    align-items: center;

    justify-content: center;

    z-index: 999;
`;

export const Modal = styled.div`
    width: 90%;

    max-width: 400px;

    position: relative;

    background-color: ${props =>
        props.theme.color.tertiary};

    padding: 30px 25px;

    border-radius: 10px;

    color: ${props => props.theme.color.white};

    box-shadow: 0 10px 30px
        rgba(0, 0, 0, 0.5);

    > h2 {
        margin-bottom: 25px;

        text-align: center;
    }
`;

export const CloseButton = styled.button`
    position: absolute;

    top: 8px;

    right: 12px;

    background: none;

    color: ${props => props.theme.color.white};

    border: none;

    font-size: 30px;

    cursor: pointer;
`;

export const Form = styled.form`
    display: flex;

    flex-direction: column;

    gap: 12px;
`;

export const Input = styled.input`
    width: 100%;

    padding: 12px;

    border: none;

    border-radius: 6px;

    font-size: 16px;

    box-sizing: border-box;
`;

export const Select = styled.select`
    width: 100%;

    padding: 12px;

    border: none;

    border-radius: 6px;

    font-size: 16px;
`;

export const Button = styled.button`
    width: 100%;

    padding: 13px;

    border: none;

    border-radius: 6px;

    background-color: ${props =>
        props.theme.color.success};

    color: white;

    font-size: 16px;

    font-weight: bold;

    cursor: pointer;

    margin-top: 10px;
`;

export const DeleteButton = styled.button`
    width: 100%;

    padding: 13px;

    border: none;

    border-radius: 6px;

    background-color: ${props =>
        props.theme.color.warning};

    color: white;

    font-size: 16px;

    font-weight: bold;

    cursor: pointer;
`;
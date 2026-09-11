import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 20px;

    box-sizing: border-box;

    background-color:
        ${props =>
            props.theme.color.primary};
`;

export const RegisterBox = styled.div`
    width: 100%;
    max-width: 400px;

    padding: 35px;

    box-sizing: border-box;

    border-radius: 10px;

    background-color:
        ${props =>
            props.theme.color.tertiary};

    color:
        ${props =>
            props.theme.color.white};

    > h1 {
        text-align: center;

        margin-bottom: 10px;
    }

    > p {
        text-align: center;

        opacity: 0.7;

        margin-bottom: 30px;
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const Input = styled.input`
    width: 100%;

    padding: 14px;

    box-sizing: border-box;

    border: none;

    border-radius: 6px;

    font-size: 16px;
`;

export const Button = styled.button`
    width: 100%;

    padding: 14px;

    border: none;

    border-radius: 6px;

    cursor: pointer;

    font-size: 16px;

    font-weight: bold;

    color: white;

    background-color:
        ${props =>
            props.theme.color.secondary};

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const ErrorMessage = styled.p`
    text-align: center;

    color: #e44c4e;

    font-size: 14px;
`;

export const LoginText = styled.p`
    margin-top: 25px;

    text-align: center;

    font-size: 14px;

    > span {
        margin-left: 5px;

        cursor: pointer;

        color:
            ${props =>
                props.theme.color.secondary};

        font-weight: bold;
    }
`;
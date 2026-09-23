import styled from "styled-components";

interface IContainerProps {
color: string;
}

export const Container = styled.div<IContainerProps>`
width: 32%;
min-width: 0;
height: 200px;


margin: 10px 0;
padding: 10px;

box-sizing: border-box;

background-color: ${props => props.color};
color: ${props => props.theme.color.white};

border-radius: 7px;

position: relative;
overflow: hidden;

> img {
    height: 110%;

    position: absolute;

    opacity: 0.3;

    top: -10px;
    right: -30px;

    pointer-events: none;
}

> span {
    font-size: 20px;
    font-weight: 500;

    display: block;
}

> h1 {
    position: relative;
    z-index: 1;

    word-break: break-word;
}

> small {
    font-size: 12px;

    position: absolute;

    bottom: 10px;
    left: 10px;
    right: 10px;

    z-index: 1;
}

@media (max-width: 1024px) {
    width: 49%;
}

@media (max-width: 768px) {
    width: 100%;
    margin: 8px 0;
}

@media (max-width: 480px) {
    height: 180px;

    > span {
        font-size: 18px;
    }

    > h1 {
        font-size: 24px;
    }

    > img {
        height: 100%;
        right: -25px;
    }
}


`;

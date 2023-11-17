import styled from "styled-components";

interface ITagProps {
    color: string;
}

export const Container = styled.li `
    background-color: ${props => props.theme.color.tertiary};

    list-style: none;
    border-radius: 10px;

    margin: 10px 0;
    padding: 12px 10px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    position: relative;

    cursor: pointer;
    transition: all 0.3s;
    &:hover{
        opacity: .7;
        transform: translateX(10px);
    }

    >div{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left:10px ;

    }
    >div span{
        font-weight: 500;
        font-size: 22px;
    }


`;


export const Tag = styled.div<ITagProps>`
    width: 12px;
    height: 70%;    
    position: absolute;
    background-color: ${props=>props.color};
    left: 0;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;

`;
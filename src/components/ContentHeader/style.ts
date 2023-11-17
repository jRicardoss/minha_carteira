import styled from "styled-components";
interface ITitleContainerProps{
    lineColor: string;
}

export const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
 
    
`;

export const TitleContainer = styled.div<ITitleContainerProps>`
   >h1{
        color: ${props => props.theme.color.white};

        &::after{
            content: '';
            display: block;
            width: 70px;
            border-bottom: 10px solid ${props=>props.lineColor};
            border-radius: 5px 2px 5px 2px;
}

}`;

export const Controllers = styled.div`
    display: flex;
`;

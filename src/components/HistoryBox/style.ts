import styled from "styled-components";
interface ILegendProps{
    color:string;

}

export const Container = styled.div`
    width: 100%;
    background-color: ${props => props.theme.color.tertiary};
    color: ${props => props.theme.color.white};

    margin: 10px 0;
    padding: 30px 20px;
    flex-direction: column;


    border-radius: 7px;
    
    `;


export const ChartContainer = styled.div`
        flex: 1;
        height: 260px;
    `;


export const Header = styled.header`
    width:100%;
    display: flex;
    justify-content: space-between;
    >h2{
        margin-bottom: 20px;
        padding-left: 17px;
        
    }

`;
export const LegendContainer = styled.ul`
    list-style: none;
    display: flex;
`;
export const Legend = styled.li<ILegendProps>`
    display: flex;
    align-items: center;
    margin-left:7px;
    padding-right: 20px;


    margin-bottom: 7px ;
    >div{
        background-color: ${props=> props.color} ;
        width: 40px;
        height: 40px;
        border-radius: 5px;
        font-size: 14px ;
        line-height: 40px;
        text-align: center;
    }
    > span{
        margin-left: 5px;
    }
`;

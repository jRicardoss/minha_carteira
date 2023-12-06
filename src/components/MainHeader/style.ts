import styled from "styled-components";
export const Container = styled.div`
    grid-area: MH;
    background-color:${props => props.theme.color.secondary};
    
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 0 10px;
    border-bottom: 1px solid${props => props.theme.color.gray};
`;

export const Profile = styled.div`
    color: ${props => props.theme.color.white};
    margin-right: 15px;
`;
export const Welcome = styled.h3`
    
`;
export const UserName = styled.span`
    
`;
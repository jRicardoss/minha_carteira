import React from "react";
import ContentHeader from "../../components/ContentHeader";
import SelectInput from "../../components/SelectInput";

import { Container } from "./styles";

const Dashboard: React.FC= ()=>{
    const options = [
        {value: 'João Ricardo',label: 'João Ricardo'},
        {value: 'Iasmim',label: 'Iasmim'},
        {value: 'Kauan',label: 'Kauan'}
    
    ] 
    return(
        <>
            <Container>
                <ContentHeader title='Dashboard' lineColor="rgb(247, 147, 27)">
                    <SelectInput options={options} onChange={()=>{}}/>
                </ContentHeader>
            </Container>
        </>
    )
};
export default Dashboard;
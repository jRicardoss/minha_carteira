import React, { useMemo } from "react";
import { Container, Profile, Welcome, UserName  } from "./style";

import emojis from "../../utils/emojis";

const MainHeader: React.FC = () => {
    const emoji = useMemo(()=>{
        const indice = Math.floor(Math.random()* emojis.length)
        return emojis[indice]
    },[])

    return (       
            <Container>
                <Profile>
                   <Welcome>Olá,{emoji}</Welcome>
                    <UserName>João Ricardo</UserName>
                </Profile>
            </Container>
    )
};
export default MainHeader;
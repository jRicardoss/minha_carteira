import React from "react";
import LogoImg from "../../assets/logo.svg";
import Button from "../../components/Buttom";

import Input from "../../components/Input";
import {
    Container,
    Logo,
    Form,
    FormTitle,
} from './style'

const SingIn: React.FC = () => {
    return (
        <Container>
            <Logo>
                <img src={LogoImg} alt="Minha Carteira" />
                <h2>Minha Carteira</h2>
            </Logo>
            <Form onSubmit={() => { }}>
                <FormTitle> Entrar </FormTitle>

                <Input
                    type="email"
                    required
                    placeholder="e-mail"
                />
                <Input
                    type="password"
                    required
                    placeholder="senha"
                />

                <Button type="submit">Acessar</Button>

            </Form>
        </Container>
    )
};
export default SingIn;
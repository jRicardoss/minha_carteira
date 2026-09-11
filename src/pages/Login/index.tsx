import React, {
    useState,
} from "react";

import {
    useHistory,
} from "react-router-dom";

import { useAuth } from "../../Hooks/auth";

import {
    Container,
    LoginBox,
    Form,
    Input,
    Button,
    ErrorMessage,
    RegisterText,
} from "./style";

const Login: React.FC = () => {

    const history = useHistory();

    const {
        login,
    } = useAuth();

    const [email, setEmail] =
        useState("");

    const [senha, setSenha] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);

            await login(
                email,
                senha
            );

            history.push("/");

        } catch (err: any) {
            setError(
                err.response?.data?.erro ||
                "Erro ao realizar login"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <LoginBox>

                <h1>
                    Minha Carteira
                </h1>

                <p>
                    Entre na sua conta
                </p>

                <Form
                    onSubmit={handleSubmit}
                >

                    <Input
                        type="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                    />

                    <Input
                        type="password"
                        placeholder="Sua senha"
                        value={senha}
                        onChange={(e) =>
                            setSenha(
                                e.target.value
                            )
                        }
                    />

                    {error && (
                        <ErrorMessage>
                            {error}
                        </ErrorMessage>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Entrando..."
                            : "Entrar"
                        }
                    </Button>

                </Form>

                <RegisterText>
                    Ainda não possui uma conta?
                    <span
                        onClick={() =>
                            history.push(
                                "/cadastro"
                            )
                        }
                    >
                        Cadastre-se
                    </span>
                </RegisterText>

            </LoginBox>
        </Container>
    );
};

export default Login;
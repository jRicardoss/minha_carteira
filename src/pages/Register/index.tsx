import React, {
    useState,
} from "react";

import {
    useHistory,
} from "react-router-dom";

import api from "../../services/api";

import {
    Container,
    RegisterBox,
    Form,
    Input,
    Button,
    ErrorMessage,
    LoginText,
} from "./style";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register: React.FC = () => {

    const history = useHistory();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validarFormulario = (): string | null => {
        if (!nome || !email || !senha || !confirmarSenha) {
            return "Preencha todos os campos";
        }

        if (!EMAIL_REGEX.test(email)) {
            return "Informe um e-mail válido";
        }

        if (senha.length < 6) {
            return "A senha deve ter pelo menos 6 caracteres";
        }

        if (senha !== confirmarSenha) {
            return "As senhas não coincidem";
        }

        return null;
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const mensagemDeErro = validarFormulario();

        if (mensagemDeErro) {
            setError(mensagemDeErro);
            return;
        }

        try {
            setError("");
            setLoading(true);

            await api.post(
                "/auth/cadastro",
                {
                    nome,
                    email,
                    senha,
                }
            );

            history.push("/login");

        } catch (err: any) {
            setError(
                err.response?.data?.erro ||
                "Erro ao criar conta"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <RegisterBox>

                <h1>Criar conta</h1>

                <p>
                    Crie sua conta para
                    controlar sua carteira
                </p>

                <Form onSubmit={handleSubmit}>

                    <Input
                        type="text"
                        placeholder="Seu nome"
                        value={nome}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNome(e.target.value)
                        }
                    />

                    <Input
                        type="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                    />

                    <Input
                        type="password"
                        placeholder="Crie uma senha"
                        value={senha}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSenha(e.target.value)
                        }
                    />

                    <Input
                        type="password"
                        placeholder="Confirme sua senha"
                        value={confirmarSenha}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setConfirmarSenha(e.target.value)
                        }
                    />

                    {error && (
                        <ErrorMessage>{error}</ErrorMessage>
                    )}

                    <Button type="submit" disabled={loading}>
                        {loading ? "Criando..." : "Criar conta"}
                    </Button>

                </Form>

                <LoginText>
                    Já possui uma conta?
                    <span onClick={() => history.push("/login")}>
                        Entrar
                    </span>
                </LoginText>

            </RegisterBox>
        </Container>
    );
};

export default Register;
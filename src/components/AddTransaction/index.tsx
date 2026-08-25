import { useState } from "react";
import api from "../../services/api";

import {
  Container,
  Select,
  Input,
  Button,
  Title,
  Form,
} from "./styles";

interface AddTransactionProps {
  onAdded?: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onAdded }) => {
  const [type, setType] = useState("entrada");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [frequency, setFrequency] = useState("eventual");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!title || !value || !date) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await api.post("/transacoes", {
        description: title,
        amount: Number(value),
        type,
        frequency,
        date
    });

      // Limpa o formulário
      setType("entrada");
      setTitle("");
      setValue("");
      setDate("");
      setFrequency("eventual");

      // Atualiza a tela que chamou o formulário
      if (onAdded) {
        onAdded();
      }

      alert("Transação adicionada com sucesso!");
    } catch (err) {
      console.error("Erro ao adicionar transação:", err);
      alert("Erro ao adicionar transação.");
    }
  };

  return (
    <Container>
      <Title>Adicionar Transação</Title>

      <Form onSubmit={handleSubmit}>
        <Select
          value={type}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setType(e.target.value)
          }
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </Select>

        <Input
          type="text"
          placeholder="Descrição"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />

        <Input
          type="number"
          placeholder="Valor"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
        />

        <Input
          type="date"
          value={date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDate(e.target.value)
          }
        />

        <Select
          value={frequency}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFrequency(e.target.value)
          }
        >
          <option value="eventual">Eventual</option>
          <option value="recorrente">Recorrente</option>
        </Select>

        <Button type="submit">Adicionar</Button>
      </Form>
    </Container>
  );
};

export default AddTransaction;
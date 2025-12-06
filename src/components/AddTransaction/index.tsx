import { useState } from "react";
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
  const [frequency, setFrequency] = useState("eventual"); // padrão

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!title || !value || !date) {
      alert("Preencha tudo, porra!");
      return;
    }

    try {
      // seleciona a rota correta
      const url =
        type === "entrada"
          ? "http://localhost:3333/entries"
          : "http://localhost:3333/expenses";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          value: Number(value),
          date,
          frequency, // agora salva: "eventual" ou "recorrente"
        }),
      });

      if (!res.ok) {
        alert("Erro ao enviar");
        return;
      }

      // limpar campos
      setType("entrada");
      setTitle("");
      setValue("");
      setDate("");
      setFrequency("eventual");

      if (onAdded) onAdded();
    } catch (err) {
      alert("Erro ao enviar");
      console.log(err);
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

        {/* FREQUÊNCIA AJUSTADA */}
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

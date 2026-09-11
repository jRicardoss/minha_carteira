import React, { useMemo, useState, useEffect } from "react";
import api from "../../services/api";

import ContentHeader from "../../components/ContentHeader";
import SelectInput from "../../components/SelectInput";
import HistoryFinanceCard from "../../components/HistoryFinanceCard";

import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import listOfMonths from "../../utils/months";

import {
    Container,
    Content,
    Filters,
    Overlay,
    Modal,
    CloseButton,
    Form,
    Input,
    Select,
    Button,
    DeleteButton,
} from "./style";

interface IRouteParams {
    match: {
        params: {
            type: string;
        };
    };
}

interface IDataItem {
    id: number | string;
    title: string;
    value: number;
    type: "income" | "expense";
    date: string;
    frequency: "recorrente" | "eventual" | string;
}

interface IFormattedData {
    id: string;
    description: string;
    amount: number;
    amountFormatted: string;
    type: "entrada" | "saida";
    frequency: "recorrente" | "eventual";
    date: string;
    dateFormatted: string;
    tagColor: string;
}

const List: React.FC<IRouteParams> = ({ match }) => {
    const movimentType = match.params.type;

    const [data, setData] = useState<IFormattedData[]>([]);

    const [monthSelected, setMonthSelected] = useState<number>(
        new Date().getMonth() + 1
    );

    const [yearSelected, setYearSelected] = useState<number>(
        new Date().getFullYear()
    );

    const [
        frequencyFilterSelected,
        setFrequencyFilterSelected,
    ] = useState<string[]>(["recorrente", "eventual"]);

    const [selectedTransaction, setSelectedTransaction] =
        useState<IFormattedData | null>(null);

    const [reload, setReload] = useState(0);

    const pageData = useMemo(() => {
        return movimentType === "entry-balance"
            ? {
                  title: "Entradas",
                  lineColor: "#f7931b",
                  type: "income" as const,
              }
            : {
                  title: "Saídas",
                  lineColor: "#E44C4E",
                  type: "expense" as const,
              };
    }, [movimentType]);

    const [years, setYears] = useState<
        { value: number; label: number }[]
    >([]);

    const months = useMemo(() => {
        return listOfMonths.map((month, index) => ({
            value: index + 1,
            label: month,
        }));
    }, []);

    const handleFrequencyClick = (frequency: string) => {
        setFrequencyFilterSelected(prev =>
            prev.includes(frequency)
                ? prev.filter(f => f !== frequency)
                : [...prev, frequency]
        );
    };

    const handleMonthSelected = (month: string) => {
        setMonthSelected(Number(month));
    };

    const handleYearSelected = (year: string) => {
        setYearSelected(Number(year));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/transacoes");

                const transacoes: IDataItem[] = res.data.map(
                    (item: any) => ({
                        id: item.id,
                        title: item.description,
                        value: Number(item.amount),
                        type:
                            item.type === "entrada"
                                ? "income"
                                : "expense",
                        date: item.date,
                        frequency: item.frequency,
                    })
                );

                const transacoesDoTipo = transacoes.filter(
                    item => item.type === pageData.type
                );

                const uniqueYears = Array.from(
                    new Set(
                        transacoesDoTipo.map(item =>
                            new Date(item.date).getFullYear()
                        )
                    )
                );

                setYears(
                    uniqueYears.map(year => ({
                        value: year,
                        label: year,
                    }))
                );

                const filteredData = transacoesDoTipo.filter(item => {
                    const date = new Date(item.date);

                    const month = date.getMonth() + 1;

                    const year = date.getFullYear();

                    const frequency = String(
                        item.frequency || ""
                    ).toLowerCase();

                    return (
                        month === monthSelected &&
                        year === yearSelected &&
                        frequencyFilterSelected.includes(frequency)
                    );
                });

                const formattedData: IFormattedData[] =
                    filteredData.map(item => {
                        const freqNorm = String(
                            item.frequency || ""
                        ).toLowerCase();

                        const frequency:
                            | "recorrente"
                            | "eventual" = freqNorm.includes(
                            "recorr"
                        )
                            ? "recorrente"
                            : "eventual";

                        return {
                            id: item.id.toString(),

                            description: item.title,

                            amount: Number(item.value),

                            amountFormatted: formatCurrency(
                                Number(item.value)
                            ),

                            type:
                                item.type === "income"
                                    ? "entrada"
                                    : "saida",

                            frequency,

                            date: item.date,

                            dateFormatted: formatDate(
                                item.date
                            ),

                            tagColor:
                                frequency === "recorrente"
                                    ? "#4E41F0"
                                    : "#E44C4E",
                        };
                    });

                setData(formattedData);
            } catch (err) {
                console.error(
                    "Erro ao buscar transações:",
                    err
                );
            }
        };

        fetchData();
    }, [
        pageData,
        monthSelected,
        yearSelected,
        frequencyFilterSelected,
        reload,
    ]);

    const handleUpdate = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!selectedTransaction) return;

        try {
            await api.put(
                `/transacoes/${selectedTransaction.id}`,
                {
                    description:
                        selectedTransaction.description,

                    amount:
                        Number(selectedTransaction.amount),

                    type:
                        selectedTransaction.type,

                    frequency:
                        selectedTransaction.frequency,

                    date:
                        selectedTransaction.date,
                }
            );

            alert("Transação atualizada com sucesso!");

            setSelectedTransaction(null);

            setReload(prev => prev + 1);
        } catch (err) {
            console.error(
                "Erro ao atualizar transação:",
                err
            );

            alert("Erro ao atualizar transação.");
        }
    };

    const handleDelete = async () => {
        if (!selectedTransaction) return;

        const confirmDelete = window.confirm(
            `Deseja realmente excluir "${selectedTransaction.description}"?`
        );

        if (!confirmDelete) return;

        try {
            await api.delete(
                `/transacoes/${selectedTransaction.id}`
            );

            alert("Transação excluída com sucesso!");

            setSelectedTransaction(null);

            setReload(prev => prev + 1);
        } catch (err) {
            console.error(
                "Erro ao excluir transação:",
                err
            );

            alert("Erro ao excluir transação.");
        }
    };

    return (
        <Container>
            <ContentHeader
                title={pageData.title}
                lineColor={pageData.lineColor}
            >
                <SelectInput
                    options={months}
                    onChange={e =>
                        handleMonthSelected(e.target.value)
                    }
                    defaultValue={monthSelected}
                />

                <SelectInput
                    options={years}
                    onChange={e =>
                        handleYearSelected(e.target.value)
                    }
                    defaultValue={yearSelected}
                />
            </ContentHeader>

            <Filters>
                <button
                    type="button"
                    className={`tag-filter tag-filter-recurrent ${
                        frequencyFilterSelected.includes(
                            "recorrente"
                        )
                            ? "tag-actived"
                            : ""
                    }`}
                    onClick={() =>
                        handleFrequencyClick("recorrente")
                    }
                >
                    Recorrentes
                </button>

                <button
                    type="button"
                    className={`tag-filter tag-filter-eventual ${
                        frequencyFilterSelected.includes(
                            "eventual"
                        )
                            ? "tag-actived"
                            : ""
                    }`}
                    onClick={() =>
                        handleFrequencyClick("eventual")
                    }
                >
                    Eventuais
                </button>
            </Filters>

            <Content>
                {data.map(item => (
                    <HistoryFinanceCard
                        key={item.id}
                        tagColor={item.tagColor}
                        title={item.description}
                        subtitle={item.dateFormatted}
                        amount={item.amountFormatted}
                        onClick={() =>
                            setSelectedTransaction(item)
                        }
                    />
                ))}
            </Content>

            {selectedTransaction && (
                <Overlay
                    onClick={() =>
                        setSelectedTransaction(null)
                    }
                >
                    <Modal
                        onClick={e =>
                            e.stopPropagation()
                        }
                    >
                        <CloseButton
                            onClick={() =>
                                setSelectedTransaction(null)
                            }
                        >
                            ×
                        </CloseButton>

                        <h2>Editar transação</h2>

                        <Form onSubmit={handleUpdate}>
                            <Input
                                type="text"
                                value={
                                    selectedTransaction.description
                                }
                                onChange={e =>
                                    setSelectedTransaction({
                                        ...selectedTransaction,
                                        description:
                                            e.target.value,
                                    })
                                }
                            />

                            <Input
                                type="number"
                                value={
                                    selectedTransaction.amount
                                }
                                onChange={e =>
                                    setSelectedTransaction({
                                        ...selectedTransaction,
                                        amount: Number(
                                            e.target.value
                                        ),
                                    })
                                }
                            />

                            <Input
                                type="date"
                                value={
                                    selectedTransaction.date
                                }
                                onChange={e =>
                                    setSelectedTransaction({
                                        ...selectedTransaction,
                                        date:
                                            e.target.value,
                                    })
                                }
                            />

                            <Select
                                value={
                                    selectedTransaction.type
                                }
                                onChange={e =>
                                    setSelectedTransaction({
                                        ...selectedTransaction,
                                        type: e.target
                                            .value as
                                            | "entrada"
                                            | "saida",
                                    })
                                }
                            >
                                <option value="entrada">
                                    Entrada
                                </option>

                                <option value="saida">
                                    Saída
                                </option>
                            </Select>

                            <Select
                                value={
                                    selectedTransaction.frequency
                                }
                                onChange={e =>
                                    setSelectedTransaction({
                                        ...selectedTransaction,
                                        frequency: e.target
                                            .value as
                                            | "recorrente"
                                            | "eventual",
                                    })
                                }
                            >
                                <option value="eventual">
                                    Eventual
                                </option>

                                <option value="recorrente">
                                    Recorrente
                                </option>
                            </Select>

                            <Button type="submit">
                                Salvar alterações
                            </Button>

                            <DeleteButton
                                type="button"
                                onClick={handleDelete}
                            >
                                Excluir transação
                            </DeleteButton>
                        </Form>
                    </Modal>
                </Overlay>
            )}
        </Container>
    );
};

export default List;
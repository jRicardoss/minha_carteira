import React, { useState, useMemo, useCallback, useEffect } from "react";
import  api  from '../../services/api';

import ContentHeader from "../../components/ContentHeader";
import SelectInput from "../../components/SelectInput";
import WalletBox from '../../components/WalletBox';
import MensageBox from '../../components/MessageBox';
import PieCharBoxt from '../../components/PieCharBoxt';
import HistoryBox from "../../components/HistoryBox";
import BarChartBox from "../../components/BarChartBox";

import listOfMonths from '../../utils/months';

import happyImg from '../../assets/happy.svg';
import sadImg from '../../assets/grinning.svg';
import grinnigImg from '../../assets/grinning.svg';
import opsImg from '../../assets/thinking.png';

import { Container, Content } from "./styles";

interface IDataItem {
    id: number | string;
    title: string;
    value: number;
    type: 'income' | 'expense';
    date: string;
    frequency?: 'recorrente' | 'eventual'; // opcional, caso venha do backend
}

const Dashboard: React.FC = () => {
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
    const [entries, setEntries] = useState<IDataItem[]>([]);
    const [expenses, setExpenses] = useState<IDataItem[]>([]);

// Buscar transações do SQLite através do backend
useEffect(() => {
    const fetchData = async () => {
        try {
            const resposta = await api.get("/transacoes");

            const transacoes = resposta.data;

            const entradas: IDataItem[] = transacoes
                .filter((item: any) => item.type === "entrada")
                .map((item: any) => ({
                    id: item.id,
                    title: item.description,
                    value: Number(item.amount),
                    type: "income",
                    date: item.date,
                    frequency: item.frequency,
                }));

            const saidas: IDataItem[] = transacoes
                .filter((item: any) => item.type === "saida")
                .map((item: any) => ({
                    id: item.id,
                    title: item.description,
                    value: Number(item.amount),
                    type: "expense",
                    date: item.date,
                    frequency: item.frequency,
                }));

            setEntries(entradas);
            setExpenses(saidas);

        } catch (err) {
            console.error(
                "Erro ao buscar transações:",
                err
            );
        }
    };

    const handleTransactionsUpdated = () => {
        fetchData();
    };

    // Busca os dados inicialmente
    fetchData();

    // Escuta alterações nas transações
    window.addEventListener(
        "transacoesAtualizadas",
        handleTransactionsUpdated
    );

    // Remove o evento ao sair do Dashboard
    return () => {
        window.removeEventListener(
            "transacoesAtualizadas",
            handleTransactionsUpdated
        );
    };

}, []);

    // Anos disponíveis
    const years = useMemo(() => {
        const uniqueYears = Array.from(
            new Set([...entries, ...expenses].map(item => new Date(item.date).getFullYear()))
        );
        return uniqueYears.map(year => ({ value: year, label: year }));
    }, [entries, expenses]);

    const months = useMemo(() => {
        return listOfMonths.map((month, index) => ({
            value: index + 1,
            label: month,
        }));
    }, []);

    const totalGains = useMemo(() => {
        return entries
            .filter(item => {
                const date = new Date(item.date);
                return date.getMonth() + 1 === monthSelected && date.getFullYear() === yearSelected;
            })
            .reduce((acc, item) => acc + Number(item.value), 0);
    }, [entries, monthSelected, yearSelected]);

    const totalExpenses = useMemo(() => {
        return expenses
            .filter(item => {
                const date = new Date(item.date);
                return date.getMonth() + 1 === monthSelected && date.getFullYear() === yearSelected;
            })
            .reduce((acc, item) => acc + Number(item.value), 0);
    }, [expenses, monthSelected, yearSelected]);

    const totalBalance = useMemo(() => totalGains - totalExpenses, [totalGains, totalExpenses]);

    const message = useMemo(() => {
        if (totalBalance < 0) {
            return {
                title: "Ops!",
                description: "Neste mês, você gastou mais do que deveria!",
                footerText: "Verifique suas saídas e tente cortar gastos desnecessários",
                icon: opsImg,
            };
        } else if (totalGains === 0 && totalExpenses === 0) {
            return {
                title: "Tá liso!",
                description: "Neste mês, não há registros de entradas ou saídas!",
                footerText: "Parece que você não fez nenhum registro esse mês",
                icon: sadImg,
            };
        } else if (totalBalance === 0) {
            return {
                title: "Ufaa!",
                description: "Neste mês, você gastou exatamente o que ganhou!",
                footerText: "Tenha cuidado. Na próxima tente poupar mais o seu dinheiro",
                icon: grinnigImg,
            };
        } else {
            return {
                title: "Muito Bem!",
                description: "Sua carteira está positiva!",
                footerText: "Continue assim. Considere investir o seu saldo",
                icon: happyImg,
            };
        }
    }, [totalBalance, totalGains, totalExpenses]);

    const relationExpensesVSGains = useMemo(() => {
        const total = totalGains + totalExpenses;
        const percentGains = total ? Number(((totalGains / total) * 100).toFixed(1)) : 0;
        const percentExpenses = total ? Number(((totalExpenses / total) * 100).toFixed(1)) : 0;

        return [
            { name: "Entradas", value: totalGains, percent: percentGains, color: '#f7931b' },
            { name: "Saídas", value: totalExpenses, percent: percentExpenses, color: '#e44c4e' }
        ];
    }, [totalGains, totalExpenses]);

    const HistoryData = useMemo(() => {
        return listOfMonths.map((_, monthIndex) => {
            const amountInput = entries
                .filter(e => new Date(e.date).getMonth() === monthIndex && new Date(e.date).getFullYear() === yearSelected)
                .reduce((acc, e) => acc + Number(e.value), 0);

            const amountOutput = expenses
                .filter(e => new Date(e.date).getMonth() === monthIndex && new Date(e.date).getFullYear() === yearSelected)
                .reduce((acc, e) => acc + Number(e.value), 0);

            return {
                monthNumber: monthIndex,
                month: listOfMonths[monthIndex].substr(0, 3),
                amountInput,
                amountOutput,
            };
        }).filter(item => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            return yearSelected < currentYear || (yearSelected === currentYear && item.monthNumber <= currentMonth);
        });
    }, [entries, expenses, yearSelected]);

    const calcRecurrentEventual = (list: IDataItem[], monthSelected: number, yearSelected: number) => {
        const filtered = list.filter(item => {
            const date = new Date(item.date);
            return date.getMonth() + 1 === monthSelected && date.getFullYear() === yearSelected;
        });

        let recurrent = 0;
        let eventual = 0;
        filtered.forEach(item => {
            if (item.frequency === 'recorrente') recurrent += Number(item.value);
            if (item.frequency === 'eventual') eventual += Number(item.value);
        });

        const total = recurrent + eventual;
        return [
            { name: 'Recorrentes', amount: recurrent, percent: total ? Number(((recurrent / total) * 100).toFixed(1)) : 0, color: '#4e41f0' },
            { name: 'Eventuais', amount: eventual, percent: total ? Number(((eventual / total) * 100).toFixed(1)) : 0, color: '#e44c4e' },
        ];
    };

  const relationExpensesRecurrentVSEventual = useMemo(
  () => calcRecurrentEventual(expenses, monthSelected, yearSelected),
  [expenses, monthSelected, yearSelected]
);

const relationGainsRecurrentVSEventual = useMemo(
  () => calcRecurrentEventual(entries, monthSelected, yearSelected),
  [entries, monthSelected, yearSelected]
);

    const handleMonthSelected = useCallback((month: string) => setMonthSelected(Number(month)), []);
    const handleYearSelected = useCallback((year: string) => setYearSelected(Number(year)), []);

    return (
        <Container>
            <ContentHeader title='Dashboard' lineColor="#4E41F0">
                <SelectInput options={months} onChange={e => handleMonthSelected(e.target.value)} defaultValue={monthSelected} />
                <SelectInput options={years} onChange={e => handleYearSelected(e.target.value)} defaultValue={yearSelected} />
            </ContentHeader>

            <Content>
                <WalletBox title='Saldo' color="#4e41f0" amount={totalBalance} footerLabel="Atualizado com base nas entradas e saídas" icon="dolar" />
                <WalletBox title='Entradas' color="#f7931b" amount={totalGains} footerLabel="Atualizado com base nas entradas e saídas" icon="arrowUp" />
                <WalletBox title='Saídas' color="#e44c4e" amount={totalExpenses} footerLabel="Atualizado com base nas entradas e saídas" icon="arrowDown" />

                <MensageBox title={message.title} description={message.description} footerText={message.footerText} icon={message.icon} />

                <PieCharBoxt data={relationExpensesVSGains} />
                <HistoryBox data={HistoryData} lineColorAmountInput="#f7931b" lineColorAmountOutput="#e44c4e" />
                <BarChartBox title="Saídas" data={relationExpensesRecurrentVSEventual} />
                <BarChartBox title="Entradas" data={relationGainsRecurrentVSEventual} />
            </Content>
        </Container>
    );
};

export default Dashboard;

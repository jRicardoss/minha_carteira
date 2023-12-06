import React, { useState, useMemo, useCallback } from "react";

import ContentHeader from "../../components/ContentHeader";
import SelectInput from "../../components/SelectInput";
import WalletBox from '../../components/WalletBox'
import MensageBox from '../../components/MessageBox'
import PieCharBoxt from '../../components/PieCharBoxt'
import HistoryBox from "../../components/HistoryBox";
import BarChartBox from "../../components/BarChartBox";


import listOfMonths from '../../utils/months';
import gains from "../../repositories/gains";
import expenses from "../../repositories/expenses";

import happyImg from '../../assets/happy.svg'
import sadImg from '../../assets/grinning.svg'
import grinnigImg from '../../assets/grinning.svg'
import opsImg from '../../assets/thinking.png'




import { Container, Content } from "./styles";

const Dashboard: React.FC = () => {
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
    const years = useMemo(() => {
        let uniqueYears: number[] = [];



        [...expenses, ...gains].forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();

            if (!uniqueYears.includes(year)) {
                uniqueYears.push(year)
            }
        });

        return uniqueYears.map(year => {
            return {
                value: year,
                label: year,
            }
        });
    }, []);


    const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
            return {
                value: index + 1,
                label: month,
            }
        });
    }, []);

    const totalExpenses = useMemo(() => {
        let total: number = 0;

        expenses.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            if (month === monthSelected && year === yearSelected) {
                try {
                    total += Number(item.amount)
                } catch {
                    throw new Error('Invalid amount! Amount must be number.')
                }
            }
        });
        return total
    }, [monthSelected, yearSelected])

    const totalGains = useMemo(() => {
        let total: number = 0;

        gains.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            if (month === monthSelected && year === yearSelected) {
                try {
                    total += Number(item.amount)
                } catch {
                    throw new Error('Invalid amount! Amount must be number.')
                }
            }
        });
        return total
    }, [monthSelected, yearSelected])

    const totalBalance = useMemo(() => {
        return totalGains - totalExpenses
    }, [totalExpenses, totalGains])

    const message = useMemo(() => {
        if (totalBalance < 0) {
            return {
                title: "Ops!",
                description: "Neste mês, você gastou mais do que deveria!",
                footerText: "Verifique suas saídas e tente cortar gastos desnecessários",
                icon: opsImg,
            }

        } 
        else if (totalGains === 0 && totalExpenses === 0 ){
            return {
                title: "Tá liso!",
                description: "Neste mês, não há registros de entradas ou saídas!",
                footerText: "Parece que você não fez nenhum registro esse mês",
                icon: sadImg,
            }

        }
        else if (totalBalance === 0) {
            return {
                title: "Ufaa!",
                description: "Neste mês, você gastou exatamente o que ganhou!",
                footerText: "Tenha cuidado. Na próxima tente poupar mais o seu dinheiro",
                icon: grinnigImg,
            }
        } 
        else {
            return {
                title: "Muito Bem!",
                description: "Sua carteira está positiva!",
                footerText: "Continue assim. Considere investir o seu saldo",
                icon: happyImg,
            }
        }
    }, [totalBalance, totalExpenses, totalGains])

    const relationExpensesVSGains = useMemo(() => {
        const total = totalGains + totalExpenses

        const percentGains =Number(( (totalGains / total) * 100).toFixed(1))
        const percentExpenses =Number(( (totalExpenses / total) * 100).toFixed(1))
        const data = [
            {
                name: "Entradas",
                value: totalGains,
                percent: percentGains ? percentGains : 0,
                color: '#f7931b',
            },
            {
                name: "Saídas",
                value: totalExpenses,
                percent: percentExpenses ? percentExpenses : 0,
                color: '#e44c4e',
            },
        ];
        return data

    }, [totalExpenses, totalGains])

    const HistoryData = useMemo(() => {
        return listOfMonths.map((_, month) => {
            let amountInput = 0;
            gains.forEach(gain => {
                const date = new Date(gain.date);
                const gainMonth = date.getMonth();
                const gainYear = date.getFullYear();
                if (gainMonth === month && gainYear === yearSelected) {
                    try {
                        amountInput += Number(gain.amount)

                    } catch {
                        throw new Error('error, number is invalid ')

                    }
                }

            });
            let amountOutput = 0;
            expenses.forEach(expenses => {
                const date = new Date(expenses.date);
                const expensesMonth = date.getMonth();
                const expensesYear = date.getFullYear();
                if (expensesMonth === month && expensesYear === yearSelected) {
                    try {
                        amountOutput += Number(expenses.amount)

                    } catch {
                        throw new Error('error, number is invalid ')

                    }
                }

            })
            return {
                monthNumber: month,
                month: listOfMonths[month].substr(0, 3),
                amountInput,
                amountOutput,
            }
        })
            .filter(item => {
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                return (yearSelected === currentYear && item.monthNumber <= currentMonth) || (yearSelected < currentYear)

            });
    }, [yearSelected])

    const relationExpensesRecurrentVSEventual = useMemo(() => {
        let amountRecurrent = 0;
        let amountEventual = 0;
        expenses
            .filter((expense) => {
                const date = new Date(expense.date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;

                return month === monthSelected && year === yearSelected;
            })
            .forEach((expense) => {
                if (expense.frequency === 'recorrente') {
                    return amountRecurrent += Number(expense.amount);
                }
                if (expense.frequency === 'eventual') {
                    return amountEventual += Number(expense.amount);
                }
            })
        const total = amountRecurrent + amountEventual;
        const percentRecurrent =  Number(((amountRecurrent / total) * 100).toFixed(1));
        const percentEventual = Number(((amountEventual / total) * 100).toFixed(1));
        return [
            {
                name: 'Recorrentes',
                amount: amountRecurrent,
                percent:percentRecurrent ? percentRecurrent : 0,
                color: '#4e41f0',
            },
            {
                name: 'Eventuais',
                amount: amountEventual,
                percent: percentEventual ? percentEventual : 0,
                color: '#e44c4e',
            }

        ]
    }, [monthSelected, yearSelected])

    const relationGainsRecurrentVSEventual = useMemo(() => {
        let amountRecurrent = 0;
        let amountEventual = 0;
        gains
            .filter((gain) => {
                const date = new Date(gain.date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;

                return month === monthSelected && year === yearSelected;
            })
            .forEach((gain) => {
                if (gain.frequency === 'recorrente') {
                    return amountRecurrent += Number(gain.amount);
                }
                if (gain.frequency === 'eventual') {
                    return amountEventual += Number(gain.amount);
                }
            })
        const total = amountRecurrent + amountEventual;
        const percentRecurrent =  Number(((amountRecurrent / total) * 100).toFixed(1));
        const percentEventual = Number(((amountEventual / total) * 100).toFixed(1));
     
        return [
            {
                name: 'Recorrentes',
                amount: amountRecurrent,
                percent: percentRecurrent ? percentRecurrent : 0,
                color: '#4e41f0',
            },
            {
                name: 'Eventuais',
                amount: amountEventual,
                percent: percentEventual ? percentEventual: 0,
                color: '#e44c4e',
            }

        ]
    }, [monthSelected, yearSelected])
    const handleMonthSelected = useCallback((month: string) => {
        try {
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        }
        catch {
            throw new Error('invalid month value. Is accept 0 - 24.')
        }
    },[])

    const handleYearSelected = useCallback((year: string) => {
        try {
            const parseYear = Number(year);
            setYearSelected(parseYear);
        }
        catch {
            throw new Error('invalid year value. Is accept integer numbers.')
        }
    },[])
    return (

        <Container>
            <ContentHeader title='Dashboard' lineColor="#4E41F0 ">
                <SelectInput
                    options={months}
                    onChange={(e) => handleMonthSelected(e.target.value)}
                    defaultValue={monthSelected}
                />
                <SelectInput
                    options={years}
                    onChange={(e) => handleYearSelected(e.target.value)}
                    defaultValue={yearSelected}
                />
            </ContentHeader>
            <Content>
                <WalletBox
                    title='saldo'
                    color="#4e41f0"
                    amount={totalBalance}
                    footerLabel="atualizado com base nas entradas e saídas"
                    icon="dolar"
                />
                <WalletBox
                    title='entradas'
                    color="#f7931b"
                    amount={totalGains}
                    footerLabel="atualizado com base nas entradas e saídas"
                    icon="arrowUp"
                />
                <WalletBox
                    title='saídas'
                    color="#e44c4e"
                    amount={totalExpenses}
                    footerLabel="atualizado com base nas entradas e saídas"
                    icon="arrowDown"
                />
                <MensageBox
                    title={message.title}
                    description={message.description}
                    footerText={message.footerText}
                    icon={message.icon}
                />
                <PieCharBoxt
                    data={relationExpensesVSGains}
                />

                <HistoryBox
                    data={HistoryData}
                    lineColorAmountInput="#f7931b"
                    lineColorAmountOutput="#e44c4e"

                />
                <BarChartBox
                    title="Saídas"
                    data={relationExpensesRecurrentVSEventual}
                />
                <BarChartBox
                    title="Entradas"
                    data={relationGainsRecurrentVSEventual}
                />
            </Content>
        </Container>

    )
};
export default Dashboard;
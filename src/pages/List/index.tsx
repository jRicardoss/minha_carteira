import React, { useMemo, useState, useEffect } from "react";
import ContentHeader from "../../components/ContentHeader";
import SelectInput from "../../components/SelectInput";
import HistoryFinanceCard from "../../components/HistoryFinanceCard";
import listOfMonths from "../../utils/months";
import gains from "../../repositories/gains";
import expenses from "../../repositories/expenses";
import { nanoid } from 'nanoid';
import formatCurrency from "../../utils/formatCurrency";
import formateDate from "../../utils/formatDate";
import { Container, Content, Filters } from "./style";
interface IRouteParams {
    match: {
        params: {
            movimentType: string;
        }
    }
}
interface IData {
    description: string;
    amountFormatted: string;
    frequency: string;
    dateFormatted: string;
    tagColor: string;
    id: string;
}

const List: React.FC<IRouteParams> = ({ match }) => {
    const [data, setData] = useState<IData[]>([]);
    const [monthSelected, setMonthSelected] = useState<string>(String(new Date().getMonth() + 1));
    const [yearSelected, setYearSelected] = useState<string>(String(new Date().getFullYear()));
    const [frequencyFilterSelected, setFrequencyFilterSelected] = useState(['recorrente', 'eventual']);

    const { movimentType} = match.params;
    const pageData = useMemo(()=>{
        return movimentType === 'entry-balance' ?
        {
            title: 'Entradas',
            lineColor: '#f7931b',
            data: gains
        }
        :
        {
            title: 'Saídas',
            lineColor: '#e44c4e',
            data: expenses
        }
    },[movimentType])


    const years = useMemo(() => {
        const {data} =pageData

        let uniqueYears: number[] = []
        data.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            if (!uniqueYears.includes(year)) {
                uniqueYears.push(year)
            }
        });
        return uniqueYears.map(year => {
            return {
                value: year,
                label: year
            }
        });
    }, [data]);

    const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
            return {
                value: index + 1,
                label: month,
            }
        });
    }, []);
    const handleFrequencyClick = (frequency: string) => {
        const alreadySelected = frequencyFilterSelected.findIndex(item => item === frequency);
        if (alreadySelected >= 0) {
            const filtered = frequencyFilterSelected.filter(item => item !== frequency);
            setFrequencyFilterSelected(filtered);
        } else {
            setFrequencyFilterSelected((prev) => [...prev, frequency]);
        };
    };
    useEffect(() => {
        const {data} =pageData

        const filteredDate = data.filter(item => {
            const date = new Date(item.date);
            const month = String(date.getMonth() + 1);
            const year = String(date.getFullYear());

            return month === monthSelected && year === yearSelected && frequencyFilterSelected.includes(item.frequency);
        });
        const formattedData = filteredDate.map(item => {
            return {
                id: nanoid(),
                description: item.description,
                amountFormatted: formatCurrency(Number(item.amount)),
                frequency: item.frequency,
                dateFormatted: formateDate(item.date),
                tagColor: item.frequency === 'recorrente' ? '#4e41f0' : '#e44c4e'
            };
        });
        setData(formattedData);
    }, [data, monthSelected, yearSelected, data.length, frequencyFilterSelected]);
    return (
        <Container>
            <ContentHeader title={pageData.title} lineColor={pageData.lineColor}>
                <SelectInput options={months} onChange={(e) => setMonthSelected(e.target.value)} defaultValue={monthSelected} />
                <SelectInput options={years} onChange={(e) => setYearSelected(e.target.value)} defaultValue={yearSelected} />
            </ContentHeader>
            <Content>

                <Filters>
                    <button type="button"
                        className={`tag-filter tag-filter-recurrent
                        ${frequencyFilterSelected.includes('recorrente') && 'tag-actived'}
                        
                        `}
                        onClick={() => handleFrequencyClick('recorrente')}
                    >
                        Recorrentes
                    </button>
                    <button type="button"
                        className={`tag-filter tag-filter-eventual
                        ${frequencyFilterSelected.includes('eventual') && 'tag-actived'}
                        `}
                        onClick={() => handleFrequencyClick('eventual')}
                    >
                        Eventuais
                    </button>
                </Filters>
                {data.map(item => (
                    <HistoryFinanceCard
                        key={item.id}
                        tagColor={item.tagColor}
                        title={item.description}
                        subtitle={item.dateFormatted}
                        amount={item.amountFormatted}

                    />

                ))
                }

            </Content>
        </Container>
    )
};
export default List;
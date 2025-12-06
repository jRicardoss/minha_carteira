import React, { useMemo, useState, useEffect } from 'react';
import { api } from '../../services/api';
import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';

import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';
import listOfMonths from '../../utils/months';

import { Container, Content, Filters } from './style';

interface IRouteParams {
  match: { params: { type: string } };
}

interface IDataItem {
  id: number | string;
  title: string;
  value: number;
  type: 'income' | 'expense';
  date: string;
  // agora o TS sabe que existe frequency
  frequency: 'recorrente' | 'eventual' | string;
}

interface IFormattedData {
  id: string;
  description: string;
  amountFormatted: string;
  frequency: 'recorrente' | 'eventual';
  dateFormatted: string;
  tagColor: string;
}

const List: React.FC<IRouteParams> = ({ match }) => {
  const movimentType = match.params.type;

  const [data, setData] = useState<IFormattedData[]>([]);
  const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
  const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
  const [frequencyFilterSelected, setFrequencyFilterSelected] = useState<string[]>(['recorrente', 'eventual']);

  const pageData = useMemo(() => {
    return movimentType === 'entry-balance'
      ? { title: 'Entradas', lineColor: '#f7931b', type: 'income' as const }
      : { title: 'Saídas', lineColor: '#E44C4E', type: 'expense' as const };
  }, [movimentType]);

  const [years, setYears] = useState<{ value: number; label: number }[]>([]);

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

  const handleMonthSelected = (month: string) => setMonthSelected(Number(month));
  const handleYearSelected = (year: string) => setYearSelected(Number(year));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const route = pageData.type === 'income' ? '/entries' : '/expenses';
        const res = await api.get<IDataItem[]>(route);

        // monta anos únicos
        const uniqueYears = Array.from(new Set(res.data.map(item => new Date(item.date).getFullYear())));
        setYears(uniqueYears.map(y => ({ value: y, label: y })));

        // filtra por mês/ano/frequência usando o campo frequency vindo do backend
        const filteredData = res.data.filter(item => {
          const date = new Date(item.date);
          const month = date.getMonth() + 1;
          const year = date.getFullYear();

          // normaliza o campo frequency pra comparação (caso venha com maiúsculas, acentos etc)
          const frequency = String(item.frequency || '').toLowerCase();

          return (
            month === monthSelected &&
            year === yearSelected &&
            frequencyFilterSelected.includes(frequency)
          );
        });

        // formatar os dados pra UI
        const formattedData: IFormattedData[] = filteredData.map(item => {
          const freqNorm = String(item.frequency || '').toLowerCase();
          const frequency: 'recorrente' | 'eventual' = freqNorm.includes('recorr') ? 'recorrente' : 'eventual';

          return {
            id: item.id.toString(),
            description: item.title,
            amountFormatted: formatCurrency(Number(item.value)),
            frequency,
            dateFormatted: formatDate(item.date),
            tagColor: frequency === 'recorrente' ? '#4E41F0' : '#E44C4E',
          };
        });

        setData(formattedData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [pageData, monthSelected, yearSelected, frequencyFilterSelected]);

  return (
    <Container>
      <ContentHeader title={pageData.title} lineColor={pageData.lineColor}>
        <SelectInput
          options={months}
          onChange={e => handleMonthSelected(e.target.value)}
          defaultValue={monthSelected}
        />
        <SelectInput
          options={years}
          onChange={e => handleYearSelected(e.target.value)}
          defaultValue={yearSelected}
        />
      </ContentHeader>

      <Filters>
        <button
          type="button"
          className={`tag-filter tag-filter-recurrent ${frequencyFilterSelected.includes('recorrente') ? 'tag-actived' : ''}`}
          onClick={() => handleFrequencyClick('recorrente')}
        >
          Recorrentes
        </button>

        <button
          type="button"
          className={`tag-filter tag-filter-eventual ${frequencyFilterSelected.includes('eventual') ? 'tag-actived' : ''}`}
          onClick={() => handleFrequencyClick('eventual')}
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
          />
        ))}
      </Content>
    </Container>
  );
};

export default List;

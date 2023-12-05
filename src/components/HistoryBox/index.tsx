import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import {
    Container,
    ChartContainer,
    Header,
    LegendContainer,
    Legend

} from "./style";

interface IHistoryBoxProps {
    data: {
        month: string
        amountInput: number
        amountOutput: number

    }[],
    lineColorAmountInput: string
    lineColorAmountOutput: string

}

const HistoryBox: React.FC<IHistoryBoxProps> = ({
    data,
    lineColorAmountInput,
    lineColorAmountOutput,
}
) => (
    <Container>
        <Header>
        <h2>Histórico de saldo</h2>
            <LegendContainer>
                <Legend color={lineColorAmountInput}>
                    <div></div>
                    <span>Saídas</span>
                </Legend>
                <Legend color={lineColorAmountOutput}>
                    <div></div>
                    <span>Saídas</span>
                </Legend>
            </LegendContainer>
        </Header>
        <ChartContainer>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cecece" />
                    <XAxis dataKey="month" stroke="#cecece" />
                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="amountInput"
                        name="Entradas"
                        stroke={lineColorAmountInput}
                        strokeWidth={5}
                        dot={{ r: 5 }}
                        activeDot
                    />
                    <Line
                        type="monotone"
                        dataKey="amountOutput"
                        name="Saídas"
                        stroke={lineColorAmountOutput}
                        strokeWidth={5}
                        dot={{ r: 5 }}
                        activeDot
                    />

                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    </Container>
)

export default HistoryBox;
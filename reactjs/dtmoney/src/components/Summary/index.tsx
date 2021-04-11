import { Container } from "./styles";
import incomeImg from '../../assets/income.svg';
import outcomeImg from '../../assets/outcome.svg';
import totalImg from '../../assets/total.svg';
import { useMemo } from "react";
import { TransactionType } from "../../types";
import { formatMoney } from "../../utils";
import { useTransactions } from "../../hooks/useTransactions";

export function Summary() {
    const { transactions } = useTransactions();

    const summary = useMemo(() => {
        return transactions.reduce((acc, transaction) => {
            if (transaction.type === TransactionType.DEPOSITY) {
                acc.deposits += transaction.amount;
                acc.total += transaction.amount;
            } else {
                acc.withdraws += transaction.amount;
                acc.total -= transaction.amount;
            }

            return acc;
        }, {
            deposits: 0,
            withdraws: 0,
            total: 0,
        })
    }, [transactions])


    return (
        <Container>
            <div>
                <header>
                    <p>Entradas</p>
                    <img src={incomeImg} alt="Entradas"/>
                </header>
                <strong>
                    {formatMoney(summary.deposits)}
                </strong>
            </div>

            <div>
                <header>
                    <p>Saidas</p>
                    <img src={outcomeImg} alt="Saidas"/>
                </header>
                <strong>- {formatMoney(summary.withdraws)}</strong>
            </div>

            <div>
                <header>
                    <p>Total</p>
                    <img src={totalImg} alt="Total"/>
                </header>
                <strong>{formatMoney(summary.total)}</strong>
            </div>
        </Container>
    )
}
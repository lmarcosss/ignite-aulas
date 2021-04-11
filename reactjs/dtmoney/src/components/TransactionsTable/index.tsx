import { Container } from "./styles";
import { formatMoney } from "../../utils";
import { formatDate } from "../../utils/format-date";
import { useTransactions } from "../../hooks/useTransactions";
export function TransactionsTable() {
    const { transactions } = useTransactions();

    return (
        <Container>
            <table>
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Valor</th>
                        <th>Categoria</th>
                        <th>Data</th>
                    </tr>
                </thead>

                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.title}</td>
                            <td className={transaction.type}>
                                {transaction.type === 'withdraw' && '- '}
                                {formatMoney(transaction.amount)}
                            </td>
                            <td>{transaction.category}</td>
                            <td>{formatDate(transaction.createdAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    )
}
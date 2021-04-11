import  { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { api } from '../services';
import { Transaction } from '../types';

interface TransactionsContextData {
    transactions: Array<Transaction>
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

export const TransactionsContext = createContext({} as TransactionsContextData);

interface Props {
    children: ReactNode;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

export function TransctionsProvider({ children }: Props) {
    const [transactions, setTransactions] = useState([] as Array<Transaction>);

    useEffect(() =>{
        api.get<{ transactions: Array<Transaction>}>('transactions')
            .then((response) => setTransactions(response.data.transactions))
    }, [setTransactions]);

    async function createTransaction(transactionInput: TransactionInput) {
        const response = await api.post('/transactions', transactionInput);
        const { transaction } = response.data;

        setTransactions([
            ...transactions,
            transaction,
        ]);
    } 

    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionsContext);

    return context;
}
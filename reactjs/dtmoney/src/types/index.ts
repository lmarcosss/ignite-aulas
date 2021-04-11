export interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    createdAt: Date;
}

export enum TransactionType {
    DEPOSITY = 'deposit',
    WITHDRAW = 'withdraw',
}
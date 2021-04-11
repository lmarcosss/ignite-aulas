import Modal from "react-modal";
import { Container, TransactionTypeContainer, RadioBox } from "./styles";
import closeImg from '../../assets/close.svg'
import incomeImg from '../../assets/income.svg'
import outcomeImg from '../../assets/outcome.svg'
import { FormEvent, useState } from "react";
import { TransactionType } from "../../types";
import { useTransactions } from "../../hooks/useTransactions";

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
}
export function NewTransactionModal({ isOpen, onRequestClose }: Props) {
    const { createTransaction } = useTransactions();

    const [title, setTitle] = useState('');
    const [value, setValue] = useState(0);
    const [category, setCategory] = useState('');
    const [type, setType] = useState(TransactionType.DEPOSITY);

    async function handleCreateNewTransaction(event: FormEvent) {
        event.preventDefault();

        await createTransaction({
            amount: value,
            title,
            category,
            type,
        });

        setTitle('');
        setValue(0);
        setCategory('');
        setType(TransactionType.DEPOSITY);
        
        onRequestClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button className="react-modal-close" type="button" onClick={onRequestClose}>
                <img src={closeImg} alt="Fechar modal" />
            </button>
            <Container onSubmit={handleCreateNewTransaction}>
                <h2>Cadastrar transação</h2>

                <input
                    onChange={(event) => setTitle(event.target.value)}
                    value={title}
                    type="text"
                    placeholder="Titulo"
                />

                <input
                    onChange={(event) => setValue(Number(event.target.value))}
                    value={value}
                    type="number"
                    placeholder="Valor"
                />

                <TransactionTypeContainer>
                    <RadioBox
                        onClick={() => { setType(TransactionType.DEPOSITY) }}
                        type="button"
                        isActive={type === TransactionType.DEPOSITY}
                        activeColor="green"
                    >
                        <img src={incomeImg} alt="Entrada"/>
                        <span>Entrada</span>
                    </RadioBox>
                    <RadioBox
                        onClick={() => { setType(TransactionType.WITHDRAW) }}
                        type="button"
                        isActive={type === TransactionType.WITHDRAW}
                        activeColor="red"
                    >
                        <img src={outcomeImg} alt="Saida"/>
                        <span>Saida</span>
                    </RadioBox>
                </TransactionTypeContainer>
                <input
                    onChange={(event) => setCategory(event.target.value)}
                    value={category}
                    type="text"
                    placeholder="Categoria"
                />

                <button type="submit">Cadastrar</button>
            </Container>
        </Modal>
    )
}
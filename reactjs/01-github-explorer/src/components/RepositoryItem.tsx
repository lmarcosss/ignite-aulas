import { Repository } from "../types";

interface Props {
    repository: Repository;
}

export function RepositoryItem({ repository }: Props) {
    return (
        <li>
            <strong>{repository?.name}</strong>
            <p>{repository?.description}</p>

            <a href={repository?.html_url}>Acessar repositório</a>
        </li>
    )
}
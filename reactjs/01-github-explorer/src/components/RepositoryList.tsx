import { useState, useEffect } from 'react';
import { RepositoryItem } from "./RepositoryItem";
import { Repository } from "../types";

import '../styles/repositories.scss';

export function RepositoryList() {
    const [repositories, setRepositories] = useState<Array<Repository>>([]);

    useEffect(() => {
        fetch('https://api.github.com/orgs/rocketseat/repos')
            .then((response) => response.json())
            .then((data: Array<Repository>) => setRepositories(data))
    }, []);

    return (
        <section className="repository-list">
            <h1>Lista de Repositórios</h1>

            <ul>
                {repositories.map(repository => (
                    <RepositoryItem
                        key={repository.id}
                        repository={repository}
                    />
                ))}
            </ul>
        </section>
    )
}
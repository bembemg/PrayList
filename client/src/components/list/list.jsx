import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function List() {
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('auth')
        if (!auth) {
            navigate('/login')
        }
    }, [navigate]);

    return (
    <div>
        <header>
            <h1>Lista de Orações</h1>

            <h3>Hoje -&gt; </h3>
        </header>
        <main>
            <ul>
                <li>
                    <input type="checkbox" name="Concluído hoje" id="completed" />
                    <div className="pray">Oração 1</div>
                    <div className="buttons">
                        <img src="./edit.svg" alt="Editar" />
                        <img src="./delete.svg" alt="Excluir" />
                    </div>
                </li>
            </ul>
        </main>




        <a href="/">Logout</a>
    </div>
    );
};

export default List;
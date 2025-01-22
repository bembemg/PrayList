import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { listAPI } from '../../services/api.js';
import './list.css';

import { FaEdit } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { MdCheckBoxOutlineBlank, MdCheckBox, MdCheck } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

function List() {
    const navigate = useNavigate();

    const [prays, setPrays] = useState([]);
    const [pray, setPray] = useState('');
    const [edit, setEdit] = useState(null);
    const [error, setError] = useState('');

    const modal = useRef();
    const showModal = useCallback(() => {
        if (modal.current) {
            modal.current.showModal();
        }
    }, [])
    const closeModal = useCallback(() => {
        if (modal.current) {
            modal.current.close();
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('auth');
        navigate('/');
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            listAPI.get('/list')
                .then(response => setPrays(response.data))
                .catch(() => setError('Erro ao carregar orações. Tente novamente.'));
        }
    }, [navigate]);

    // Adicionar oração
    const addPray = async () => {
        if (pray.trim() === '') {
            setError('Por favor, insira uma oração.');
            return;
        }
        
        try {
            const response = await listAPI.post('/list', {
                task: pray,
                completed: false,
            })

            setPrays([...prays, { id: response.data.id, task: pray, completed: false }]);
            setPray('');
            closeModal();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.err) {
                setError(err.response.data.err);
            } else {
                setError('Erro ao adicionar oração. Tente novamente.');
            }
        }
    }

    // Checkbox
    const handleCheckboxChange = async (id) => {
        const updatedPray = prays.find(pray => pray.id === id);
        updatedPray.completed = !updatedPray.completed;

        try {
            await listAPI.put(`/list/${id}`, { 
                task: updatedPray.task, completed: updatedPray.completed 
            });

            setPrays(prays.map(pray => (pray.id === id ? updatedPray : pray)));
        } catch {
            setError('Erro ao atualizar oração. Tente novamente.');
        }
    };

    // Excluir oração
    const deletePray = async (id) => {
        try {
            await listAPI.delete(`/list/${id}`);
            setPrays(prays.filter(pray => pray.id !== id));
        } catch {
            setError('Erro ao excluir oração. Tente novamente.');
        }
    }

    // Editar oração
    const editPray = (id, name) => {
        setPray(name);
        setEdit(id);
        showModal();
    }

    return (
    <div>
        <section className="container">
        <header>
            <h1>Lista de Orações</h1>
        </header>
        <main>
            <ul>
                {prays.map(pray => (
                    <li key={pray.id}>
                        <div className="checkbox" onClick={() => handleCheckboxChange(pray.id)}>
                            <input 
                                type="checkbox"
                                name="completed"
                                id="completed"
                                checked={pray.completed}
                                onChange={() => handleCheckboxChange(pray.id)}
                                />
                            {pray.completed ? <MdCheckBox color='blue' /> : <MdCheckBoxOutlineBlank />}
                        </div>
                        <span className='pray'>{pray.task}</span>
                        <div className="buttons">
                            <FaEdit size='2rem' color='blue' onClick={() => editPray(pray.id, pray.task)} />
                            <TiDelete size='2rem' color='red' onClick={() => deletePray(pray.id)} />
                        </div>
                    </li>
                ))}
            </ul>
        </main>
        <section className="include">
            <button onClick={showModal}>Incluir</button>

            <dialog ref={modal}>

                <div className='dialog-header'>
                <IoMdClose color='red' size='2rem' onClick={closeModal} id='cancel-btn' />
                <h1>{edit !== null ? 'Editar Oração' : 'Adicionar Oração'}</h1>
                </div>

                <div className="input-pray">
                <p>Oração</p>
                <input
                    type="text" 
                    placeholder="Oração" 
                    value={pray}
                    onChange={(event) => setPray(event.target.value)}
                    />
                </div>

                <button id='add' onClick={addPray}>
                    {edit !== null ? 'Salvar' : 'Adicionar'}
                </button>
            </dialog>
        </section>
            <button onClick={handleLogout}>Logout</button>
        </section>
    </div>
    );
};

export default List;
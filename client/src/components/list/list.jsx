import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './list.css'

import { FaEdit } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { MdCheckBoxOutlineBlank, MdCheckBox, MdCheck } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

function List() {
    const navigate = useNavigate();

    const [prays, setPrays] = useState([]);
    const [pray, setPray] = useState('');
    const [edit, setEdit] = useState(null);

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
        }
    }, [navigate]);

    // Adicionar oração
    const addPray = () => {
        if (pray.trim() !== '') {
            const existingPray = prays.find((item) => 
                item.name.toLowerCase() === pray.trim().toLowerCase() && item.id !== edit
            );

            if (existingPray) {
                alert('Essa oração já existe na lista.');
                return;
            }

            const newPray = {
                id: edit !== null ? edit : Date.now(),
                name: pray,
                completed: false
            }

            if (edit !== null) {
                setPrays(prays.map(item => (item.id === edit ? newPray : item)))
            } else {
                setPrays([...prays, newPray]);
            }

            setPray('');
            setEdit(null);
            closeModal();
        } else {
            alert('Por favor, insira uma oração.');
        }
    };

    // Editar oração
    const editPray = (id, name) => {
        setPray(name);
        setEdit(id);
        showModal();
    }

    // Excluir oração
    const deletePray = (id) => {
        setPrays(prays.filter(item => item.id !== id));
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
                        <span className='pray'>{pray.name}</span>
                        <div className="buttons">
                            <FaEdit size='2rem' color='blue' onClick={() => editPray(pray.id, pray.name)} />
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
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { listAPI } from '../../services/api.js';
import DarkModeToggle from '../darkMode.jsx';
// import './list.css';

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
            setEdit(null);
            setPray('');
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
            if (edit !== null) {
                await listAPI.put(`/list/${edit}`, {
                    task: pray,
                    completed: prays.find(p => p.id === edit).completed
                })

                setPrays(prays.map(p => p.id === edit ? { ...p, task: pray} : p))
            } else {
                const response = await listAPI.post('/list', {
                    task: pray,
                    completed: false,
                });

                setPrays([...prays, { 
                    id: response.data.id, task: pray, completed: false
                }]);
            } 
            setPray('');
            setEdit(null);
            closeModal();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.err) {
                setError(err.response.data.err);
            } else {
                setError('Erro ao salvar oração. Tente novamente.');
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
        <div className="min-h-screen bg-50 dark:bg-800 py-4 px-4 sm:px-6 lg:px-8">
        <DarkModeToggle />
        <section className="max-w-6xl mx-auto bg-white dark:bg-700 rounded-2xl p-8 shadow-lg mt-10 h-[42.5rem]">
            <header className="sticky top-0 bg-white dark:bg-700 pt-2 pb-4 z-10 justify-items-center">
                <h1 className="font-montserrat font-bold text-3xl text-gray-800 dark:text-100 h-16py-4">Lista de Orações</h1>
            </header>
            
            <main className="space-y-4 pt-2 overflow-y-auto h-[calc(100%-8rem)] scrollbar-thin scrollbar-thumb-600 scrollbar-track-200 hover:scrollbar-thumb-700 dark:scrollbar-thumb-300 dark:scrollbar-track-600 dark:hover:scrollbar-thumb-400">
                <ul className="space-y-3">
                    {prays.map(pray => (
                        <li key={pray.id} className="flex items-center justify-between p-4 bg-50 dark:bg-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="cursor-pointer" onClick={() => handleCheckboxChange(pray.id)}>
                                    <input 
                                        type="checkbox"
                                        name="completed"
                                        id="completed"
                                        checked={pray.completed}
                                        onChange={() => handleCheckboxChange(pray.id)}
                                        className="hidden"
                                    />
                                    {pray.completed ? 
                                        <MdCheckBox className="text-600 dark:text-300 text-2xl" /> : 
                                        <MdCheckBoxOutlineBlank className="text-600 dark:text-300 text-2xl" />
                                    }
                                </div>
                                <span className={`font-montserrat text-gray-800 dark:text-100 ${pray.completed ? 'line-through' : ''}`}>
                                    {pray.task}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => editPray(pray.id, pray.task)}
                                    className="p-2 hover:bg-100 dark:hover:bg-600 rounded-lg transition-colors">
                                    <FaEdit className="text-600 dark:text-300 text-xl" />
                                </button>
                                <button onClick={() => deletePray(pray.id)}
                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors">
                                    <TiDelete className="text-red-600 dark:text-red-400 text-xl" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>

            <section className="mt-8 flex justify-between">
                <button 
                    onClick={showModal}
                    className="bg-600 dark:bg-300 hover:bg-700 dark:hover:bg-400 text-white dark:text-gray-800 font-montserrat font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                >
                    Incluir
                </button>

                <button 
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-montserrat font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                >
                    Logout
                </button>
            </section>

            <dialog ref={modal} className="rounded-2xl p-0 bg-white dark:bg-700 shadow-xl backdrop:bg-gray-800/50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div className="p-6 w-[450px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-montserrat font-bold text-2xl text-gray-800 dark:text-100">
                            {edit !== null ? 'Editar Oração' : 'Adicionar Oração'}
                        </h2>
                        <button onClick={closeModal} className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors">
                            <IoMdClose className="text-red-600 dark:text-red-400 text-xl" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="font-montserrat font-medium text-gray-800 dark:text-100 block mb-2">
                                Oração
                            </label>
                            <input
                                type="text" 
                                placeholder="Digite sua oração" 
                                value={pray}
                                onChange={(event) => setPray(event.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-200 dark:border-600 bg-white dark:bg-800 text-800 dark:text-50 focus:ring-2 focus:ring-500 dark:focus:ring-300 focus:border-transparent outline-none transition font-montserrat"
                            />
                        </div>

                        <button 
                            onClick={addPray}
                            className="w-full bg-600 dark:bg-300 hover:bg-700 dark:hover:bg-400 text-white dark:text-gray-800 font-montserrat font-medium py-3 rounded-lg transition-colors duration-200"
                        >
                            {edit !== null ? 'Salvar' : 'Adicionar'}
                        </button>
                    </div>
                </div>
            </dialog>
        </section>
    </div>
    );
};

export default List;
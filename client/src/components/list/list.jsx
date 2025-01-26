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
    const [isClosing, setIsClosing] = useState(false);

    const modal = useRef();
    const showModal = useCallback(() => {
        if (modal.current) {
            modal.current.showModal();
        }
    }, [])
    const closeModal = useCallback(() => {
        if (modal.current) {
            setIsClosing(true);
            setTimeout(() => {
                modal.current.close();
                setIsClosing(false);
                setEdit(null);
                setPray('');
            }, 500);
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
        <div className="min-h-screen bg-50 dark:bg-zinc-950 py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out">
        <DarkModeToggle />
        <section className="max-w-6xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-lg mt-10 h-[47.5rem] transition-all duration-300 ease-in-out">
            <header className="sticky top-0 bg-white dark:bg-zinc-900 pt-2 pb-4 z-10 justify-items-center transition-all duration-300 ease-in-out">
                <h1 className="font-montserrat font-bold text-3xl text-gray-800 dark:text-100 h-16py-4 transition-all duration-300 ease-in-out">Lista de Orações</h1>
            </header>
            
            <main className="space-y-4 pt-2 overflow-y-auto h-[calc(100%-7rem)] scrollbar-thin scrollbar-thumb-400 scrollbar-track-200 hover:scrollbar-thumb-600 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-800 transition-all duration-300 ease-in-out">
                <ul className="space-y-3">
                    {prays.map(pray => (
                        <li key={pray.id} className="flex items-center justify-between p-4 bg-100 dark:bg-zinc-800 rounded-lg transition-all duration-300 ease-in-out">
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
                                        <MdCheckBox className="text-400 text-2xl"/> : 
                                        <MdCheckBoxOutlineBlank className="text-400 text-2xl"/>
                                    }
                                </div>
                                <span className="font-montserrat text-gray-800 dark:text-100 relative transition-all duration-1000 ease-in-out">
                                    {pray.task}
                                    <span className={`absolute left-0 top-1/2 h-[2px] bg-600 dark:bg-400 transition-all duration-300 ease-in-out ${pray.completed ? "w-full" : "w-0"}`} style={{ transform: "translateY(-50%) "}}></span>
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => editPray(pray.id, pray.task)}
                                    className="p-2 hover:bg-300 dark:hover:bg-900 rounded-full transition-all duration-300 ease-in-out">
                                    <FaEdit className="text-600 dark:text-400 text-xl transition-all duration-300 ease-in-out"/>
                                </button>
                                <button onClick={() => deletePray(pray.id)}
                                    className="p-2 hover:bg-red-200 dark:hover:bg-red-900 rounded-full transition-all duration-300 ease-in-out">
                                    <TiDelete className="text-red-600 dark:text-red-400 text-xl transition-all duration-300 ease-in-out" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>

            <section className="mt-5 flex justify-between">
                <button 
                    onClick={showModal}
                    className="bg-300 dark:bg-400 hover:bg-400 dark:hover:bg-500 text-gray-600 dark:text-gray-800 font-montserrat font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-[0px_0px_10px_5px] hover:shadow-200 hover:scale-105 dark:hover:shadow-950"
                >
                    Incluir
                </button>

                <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-montserrat font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-[0px_0px_10px_5px] hover:shadow-red-200 hover:scale-105 dark:hover:shadow-red-900"
                >
                    Logout
                </button>
            </section>

            <dialog ref={modal} className={`rounded-2xl p-0 bg-white dark:bg-zinc-800 shadow-xl origin-top-left transition-all duration-300 ease-in-out ${isClosing ? 'animate-closeDialog' : 'animate-openDialog'}`}>
                <div className="p-6 w-[450px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-montserrat font-bold text-2xl text-gray-800 dark:text-100">
                            {edit !== null ? 'Editar Oração' : 'Adicionar Oração'}
                        </h2>
                        <button onClick={closeModal} className="p-2 hover:bg-red-200 dark:hover:bg-red-900 rounded-full transition-all duration-300 ease-in-out">
                            <IoMdClose className="text-red-600 dark:text-red-400 text-xl transition-all duration-300 ease-in-out" />
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
                                className="w-full px-4 py-3 font-montserrat rounded-lg border border-400 bg-white dark:bg-zinc-800 text-800 dark:text-white focus:ring-2 focus:ring-500 focus:border-transparent outline-none transition duration-300 ease-in-out focus:shadow-[0px_0px_5px_3px] focus:shadow-200 dark:focus:shadow-400"
                            />
                        </div>

                        <button 
                            onClick={addPray}
                            className="w-full bg-300 dark:bg-400 hover:bg-400 dark:hover:bg-500 text-gray-600 dark:text-gray-800 font-montserrat font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-[0px_0px_10px_5px] hover:shadow-200 dark:hover:shadow-950"
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
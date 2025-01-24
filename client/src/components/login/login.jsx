import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { mainAPI } from '../../services/api.js';
import { MdError, MdErrorOutline } from "react-icons/md";
import DarkModeToggle from '../darkMode.jsx';

function Login() {
    const [loginUser, setLoginUser] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState('');

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    const login = async (event) => {
        event.preventDefault();


        if (!loginUser || !loginPassword) {
            // alert('Por favor, preencha todos os campos');
            setError('Por favor, preencha todos os campos');
            return;
        }

        try {
            const response = await mainAPI.post('/login', {
                LoginUserName: loginUser,
                LoginPassword: loginPassword,
            });


            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                sessionStorage.setItem('auth', 'true');

                setTimeout(() => {
                    navigate('/list', { replace: true });
                }, 100);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // alert('Usuário ou senha inválidos');
                setError('Usuário ou senha inválidos');
            } else {
                alert('Erro ao fazer login. Tente novamente.');
            }
        }
    }

    return (
        <div className="min-h-screen bg-50 dark:bg-zinc-950 py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out">
            <DarkModeToggle />
            <form className="max-w-6xl mx-auto flex gap-8">
                {/* Welcome Section */}
                <aside className="flex-1 bg-300 dark:bg-400 rounded-2xl p-8 shadow-lg shadow-slate-400 dark:shadow-none transform hover:scale-105 transition-all duration-300 ease-in-out cursor-default">
                    <div className="h-full flex flex-col justify-center items-center">
                        <h1 className="font-montserrat font-extrabold text-4xl text-gray-800 mb-6">
                            Bem-vindo ao PrayList
                        </h1>
                        <p className="font-montserrat font-semibold text-2xl text-gray-800 mb-2">
                            Sua lista de oração pessoal
                        </p>
                        <i className="font-montserrat italic text-lg text-800 dark:text-950 transition-all duration-300 ease-in-out">
                            1 Tessalonicenses 5:17
                        </i>
                    </div>
                </aside>

                {/* Login Form */}
                <div className="w-[450px] bg-white rounded-2xl p-8 shadow-lg shadow-slate-400 dark:shadow-none transition-all duration-300 ease-in-out">
                    <h1 className="font-montserrat font-bold text-3xl text-gray-800 mb-8">Login</h1>

                    {error && (
                        <div className="text-center mb-6 flex items-center gap-2 bg-red-100 text-red-600 p-3 rounded-lg border border-red-200 animate-[slideDown_5s_ease-in-out]" role="alert">
                            <MdErrorOutline className="text-xl flex-shrink-0"/>
                            <p className="font-montserrat text-sm">{error}</p>
                        </div>
                    )}
                    
                    <div className={`space-y-6 transition-all duration-300 ease-in-out ${error ? 'animate-contentSlideDown' : ''}`}>
                        <div>
                            <label className="font-montserrat font-medium text-gray-800 block mb-2">
                                Usuário
                            </label>
                            <input 
                                type="text"
                                className="w-full px-4 py-3 font-montserrat rounded-lg border border-400 bg-white text-800 focus:ring-2 focus:ring-500 focus:border-transparent outline-none transition duration-300 ease-in-out focus:shadow-xl focus:shadow-200 focus:scale-105"
                                placeholder='Usuário'
                                value={loginUser}
                                onChange={(e) => setLoginUser(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-montserrat font-medium text-gray-800 block mb-2">
                                Senha
                            </label>
                            <input 
                                type="password"
                                className="w-full px-4 py-3 font-montserrat rounded-lg border border-400 bg-white text-800 focus:ring-2 focus:ring-500 focus:border-transparent outline-none transition duration-300 ease-in-out focus:shadow-xl focus:shadow-200 focus:scale-105"
                                placeholder='Senha'
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                        </div>
                        
                        <button 
                            className="w-full bg-300 hover:bg-400 text-gray-800 font-montserrat font-medium py-3 rounded-lg transition-all duration-300 ease-in-out"
                            onClick={login}
                        >
                            Login
                        </button>

                        <div className="text-center mt-4">
                            <span className="font-montserrat text-gray-700">
                                Ainda não tem uma conta?{' '}
                            </span>
                            <a 
                                href="/register" 
                                className="font-montserrat text-600 hover:text-700 transition-colors duration-200"
                            >
                                Registre-se
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { mainAPI } from '../../services/api.js';

import DarkModeToggle from '../darkMode.jsx';

function Login() {
    const [loginUser, setLoginUser] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();


        if (!loginUser || !loginPassword) {
            alert('Por favor, preencha todos os campos');
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
                alert('Usuário ou senha inválidos');
            } else {
                alert('Erro ao fazer login. Tente novamente.');
            }
        }
    }

    return (
        <div className="min-h-screen bg-50 dark:bg-800 py-4 px-4 sm:px-6 lg:px-8">
            <DarkModeToggle />
            <form className="max-w-6xl mx-auto flex gap-8">
                {/* Welcome Section */}
                <aside className="flex-1 bg-100 dark:bg-700 rounded-2xl p-8 shadow-lg">
                    <div className="h-full flex flex-col justify-center items-center">
                        <h1 className="font-montserrat font-extrabold text-4xl text-gray-800 dark:text-100 mb-6">
                            Bem-vindo ao PrayList
                        </h1>
                        <p className="font-montserrat font-semibold text-2xl text-gray-700 dark:text-150 mb-2">
                            Sua lista de oração pessoal
                        </p>
                        <i className="font-montserrat italic text-lg text-950 dark:text-50">
                            1 Tessalonicenses 5:17
                        </i>
                    </div>
                </aside>

                {/* Login Form */}
                <div className="w-[450px] bg-white dark:bg-700 rounded-2xl p-8 shadow-lg">
                    <h1 className="font-montserrat font-bold text-3xl text-gray-800 dark:text-100 mb-8">Login</h1>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="font-montserrat font-medium text-gray-800 dark:text-100 block mb-2">
                                Usuário
                            </label>
                            <input 
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-200 dark:border-600 bg-white   dark:bg-800 text-800 dark:text-50 focus:ring-2 focus:ring-500 dark:focus:ring-300 focus:border-transparent outline-none transition font-montserrat"
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
                                className="w-full px-4 py-3 rounded-lg border border-200 dark:border-600 bg-white dark:bg-800 text-800 dark:text-50 focus:ring-2 focus:ring-500 dark:focus:ring-300 focus:border-transparent outline-none transition font-montserrat"
                                placeholder='Senha'
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                        </div>
                        
                        <button 
                            className="w-full bg-300 dark:bg-600 hover:bg-400 dark:hover:bg-500 text-gray-800 dark:text-50 font-montserrat font-medium py-3 rounded-lg transition-colors duration-200 ease-in-out"
                            onClick={login}
                        >
                            Login
                        </button>

                        <div className="text-center mt-4">
                            <span className="font-montserrat text-gray-700 dark:text-100">
                                Ainda não tem uma conta?{' '}
                            </span>
                            <a 
                                href="/register" 
                                className="font-montserrat text-600 dark:text-300 hover:text-700 dark:hover:text-200 transition-colors duration-200"
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
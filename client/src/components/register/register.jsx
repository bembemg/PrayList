import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mainAPI } from '../../services/api.js';
import DarkModeToggle from '../darkMode.jsx';
// import './register.css';

function Register() {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const createUser = async () => {
        try {
            mainAPI.post('/register', {
                Email: email,
                UserName: user,
                Password: password,
            })
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                console.log(err)
                setError('Erro ao criar usuário. Tente novamente.');
            }
        }
    }

    const navigate  = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não conferem');
            return;
        }

        if (email && user && password && confirmPassword) {
            createUser();
            // navigate('/');
        } else {
            setError('Preencha todos os campos');
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
                            Registre-se, é grátis!
                        </h1>
                        <p className="font-montserrat font-semibold text-2xl text-gray-700 dark:text-150 mb-2">
                            "Orai sem cessar"
                        </p>
                        <i className="font-montserrat italic text-lg text-950 dark:text-50">
                            1 Tessalonicenses 5:17
                        </i>
                    </div>
                </aside>

                {/* Register Form */}
                <div className="w-[450px] bg-white dark:bg-700 rounded-2xl p-8 shadow-lg">
                    <h1 className="font-montserrat font-bold text-3xl text-gray-800 dark:text-100 mb-8">
                        Registre-se
                    </h1>
                    
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 font-montserrat">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="font-montserrat font-medium text-gray-800 dark:text-100 block mb-2">
                                Email
                            </label>
                            <input 
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-200 dark:border-600 bg-white dark:bg-800 text-800 dark:text-50 focus:ring-2 focus:ring-500 dark:focus:ring-300 focus:border-transparent outline-none transition font-montserrat"
                                placeholder="Email"
                                value={email}
                                onChange={event => setEmail(event.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-montserrat font-medium text-gray-800 dark:text-100 block mb-2">
                                Usuário
                            </label>
                            <input 
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-200 dark:border-600 bg-white dark:bg-800 text-800 dark:text-50 focus:ring-2 focus:ring-500 dark:focus:ring-300 focus:border-transparent outline-none transition font-montserrat"
                                placeholder="Usuário"
                                value={user}
                                onChange={event => setUser(event.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-montserrat font-medium text-gray-800 dark:text-100 block mb-2">
                                Senha
                            </label>
                            <input 
                                type="password"
                                className="w-full px-4 py-3 rounded-lg border border-200 dark:border-600 bg-white dark:bg-800 text-800 dark:text-50 focus:ring-2 focus:ring-500 dark:focus:ring-300 focus:border-transparent outline-none transition font-montserrat"
                                placeholder="Senha"
                                value={password}
                                onChange={event => setPassword(event.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-montserrat font-medium text-gray-800 dark:text-100 block mb-2">
                                Confirmar Senha
                            </label>
                            <input 
                                type="password"
                                className="w-full px-4 py-3 rounded-lg border border-200 dark:border-600 bg-white dark:bg-800 text-800 dark:text-50 focus:ring-2 focus:ring-500 dark:focus:ring-300 focus:border-transparent outline-none transition font-montserrat"
                                placeholder="Confirmar Senha"
                                value={confirmPassword}
                                onChange={event => setConfirmPassword(event.target.value)}
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-300 dark:bg-600 hover:bg-400 dark:hover:bg-500 text-gray-800 dark:text-50 font-montserrat font-medium py-3 rounded-lg transition-colors duration-200 ease-in-out"
                            onClick={handleSubmit}
                        >
                            Registrar
                        </button>

                        <div className="text-center mt-4">
                            <span className="font-montserrat text-gray-700 dark:text-100">
                                Já tem uma conta?{' '}
                            </span>
                            <a 
                                href="/"
                                className="font-montserrat text-600 dark:text-300 hover:text-700 dark:hover:text-200 transition-colors duration-200"
                            >
                                Faça Login
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Register;
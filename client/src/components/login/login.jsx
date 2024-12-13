import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'
import api from '../../services/api.js';

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
            const response = await api.post('/login', {
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
        <div className='login-page'>
            <form onSubmit={login}>
                <aside>
                    <h1>Bem-vindo ao PrayList</h1>
                    <p>"Orai sem cessar"</p>
                    <i>1 Tessalonicenses 5:17</i>
                </aside>
                <fieldset>
                <h1>Login</h1>
                <p>Usuário</p>
                <input 
                    type="user" 
                    value={loginUser} 
                    placeholder="Usuário" 
                    onChange={(event) => setLoginUser(event.target.value)}
                />
                <p>Senha</p>
                <input 
                    type="password" 
                    value={loginPassword}
                    placeholder="Senha" 
                    onChange={(event) => setLoginPassword(event.target.value)}
                />
                <button type="submit">Entrar</button>
                <span>Não possui uma conta?</span>
                <a href="/register">Registre-se</a>
                </fieldset>
            </form>
        </div>
    );
};

export default Login;
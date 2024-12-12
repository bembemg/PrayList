import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'

function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (user === 'adm' && password === '123'){
            localStorage.setItem('auth', true);
            navigate('/list');
        } else {
            alert('Usuário ou senha inválidos');
        }
    }

    return (
        <div className='login-page'>
            <form onSubmit={handleSubmit}>
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
                    value={user} 
                    placeholder="Usuário" 
                    onChange={(event) => setUser(event.target.value)}
                />
                <p>Senha</p>
                <input 
                    type="password" 
                    value={password}
                    placeholder="Senha" 
                    onChange={(event) => setPassword(event.target.value)}
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
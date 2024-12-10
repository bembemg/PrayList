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
        <div>
            <form onSubmit={handleSubmit}>
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
                </fieldset>
                <p>Ainda não tem uma conta?</p>
                <a href="/register">Registre-se</a>
            </form>
        </div>
    );
};

export default Login;
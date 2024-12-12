import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css'

function Register() {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate  = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert('As senhas não conferem');
            return;
        }

        if (email && user && password && confirmPassword) {
            alert('Cadastro realizado com sucesso!');
            navigate('/login');
        } else {
            alert('Preencha todos os campos');
        }

    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <aside>
                    <h1>Registre-se, é grátis!</h1>
                    <p>"Orai sem cessar"</p>
                    <i>1 Tessalonicenses 5:17</i>
                </aside>
                <fieldset>
                    <h1>Registre-se</h1>
                    <p>Email</p>
                    <input 
                        type="email" 
                        value={email}
                        placeholder="Email" 
                        onChange={event => setEmail(event.target.value)}
                        />
                    <p>Usuário</p>
                    <input
                        type='user'
                        value={user}
                        placeholder="Usuário"
                        onChange={event => setUser(event.target.value)}
                    />
                    <p>Senha</p>
                    <input 
                        type='password'
                        value={password}
                        placeholder="Senha"
                        onChange={event => setPassword(event.target.value)}
                    />
                    <p>Confirmar Senha</p>
                    <input 
                        type='password'
                        value={confirmPassword}
                        placeholder="Confirmar Senha"
                        onChange={event => setConfirmPassword(event.target.value)}
                    />
                    <button type="submit">Registrar</button>
                    <span>Já tem uma conta?</span>
                    <a href="/">Faça Login</a>
                </fieldset>
            </form>
        </div>
    );
};

export default Register;
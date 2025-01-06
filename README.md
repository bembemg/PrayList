# 🙏 PrayList - Aplicação de Lista de Orações

## 📝 Descrição do Projeto
PrayList é uma aplicação web fullstack para gerenciamento de lista de orações para cristãos. A aplicação permite que usuários criem, editem, marquem como concluídas e excluam suas orações pessoais.

## ✨ Funcionalidades
- 🔐 Autenticação de usuários (Registro e Login)
- ➕ Adicionar novas orações
- ✏️ Editar orações existentes
- ✅ Marcar orações como concluídas
- 🗑️ Excluir orações
- 🔒 Rotas privadas protegidas por autenticação
- 🔄 Redefinição automática diária do status das orações

## 🛠️ Tecnologias Utilizadas
### Frontend
- React.js
- React Router
- Axios
- JWT Decode
- React Icons

### Backend
- Node.js
- Express.js
- PostgreSQL
- JSON Web Token (JWT)
- Cors
- Body-Parser

## 📦 Instalação

### Pré-requisitos
- Node.js
- PostgreSQL

### Passos de Instalação
1. Clone o repositório:
    ```bash
    git clone https://github.com/bembemg/PrayList
    ```

2. Instale as dependências do servidor:
    ```bash
    cd praylist/server
    npm install
    ```

3. Instale as dependências do cliente:
    ```bash
    cd ../client
    npm install
    ```

4. Configure as variáveis de ambiente:
    - Crie um arquivo `.env` na pasta `server` com as seguintes variáveis:
    ```plaintext
    DB_USER=seu_usuario_postgres
    DB_HOST=localhost
    DB_NAME=praylist
    DB_PASSWORD=sua_senha
    DB_PORT=5432
    JWT_SECRET=sua_chave_secreta
    ```

    - Crie um arquivo `.env` na pasta `client` com:
    ```plaintext
    VITE_API_URL=http://localhost:3001
    VITE_API_LISTURL=http://localhost:3002
    ```

5. Inicie o servidor:
    ```bash
    # Na pasta server
    npm start
    ```

6. Inicie o cliente:
    ```bash
    # Na pasta client
    npm run dev
    ```

## 🚀 Como Usar
1. Registre-se com um novo usuário
2. Faça login
3. Adicione suas orações
4. Gerencie suas orações (editar, marcar como concluída, excluir)

## 🔐 Segurança
- Autenticação via JWT
- Rotas protegidas
- Validação de entrada no backend
- Armazenamento seguro de tokens

## 📋 Próximas Melhorias
- Recuperação de senha
- Validações mais robustas
- Testes unitários
- Responsividade mobile

## ⚠️ Observação
Este projeto está em andamento. O frontend ainda não está concluído e, no momento, conta apenas com botões básicos para as funcionalidades. Em breve, novas funcionalidades serão adicionadas e o frontend aprimorado.

## 📞 Contato
Gabriel B. - gabrielbembemc@gmail.com

Link do Projeto: https://github.com/bembemg/PrayList

Feito com ❤️ e 🙏 inspirado em 1 Tessalonicenses 5:17

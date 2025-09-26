# Marketplace API - Projeto 3º Bimestre

API REST para um marketplace simples construída com Node.js, Express, Prisma e MySQL.

## Estrutura do Banco de Dados

### Relacionamentos
- **1:1** - User → Store (cada usuário tem uma única loja)
- **1:N** - Store → Product (cada loja tem vários produtos)

### Modelos
- **User**: Usuários do sistema
- **Store**: Lojas dos usuários
- **Product**: Produtos das lojas

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure o arquivo `.env` baseado no `.env.example`:
```bash
DATABASE_URL="mysql://USUARIO:SENHA@mysql-USUARIO.alwaysdata.net/NOME_DO_BANCO"
PORT=3000
```

3. Gere o cliente Prisma:
```bash
npx prisma generate
```

4. Aplique o schema no banco:
```bash
npx prisma db push
```

5. Execute o servidor:
```bash
npm run dev
```

## Rotas da API

### Users (Usuários)

#### POST /usuarios
Cria um novo usuário.
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

#### GET /usuarios
Lista todos os usuários (inclui suas lojas).

#### GET /usuarios/:id
Busca um usuário específico (inclui loja e produtos da loja).

#### PUT /usuarios/:id
Atualiza um usuário.
```json
{
  "name": "João Santos",
  "email": "joao.santos@email.com",
  "password": "nova123"
}
```

#### DELETE /usuarios/:id
Remove um usuário (e sua loja em cascata).

### Stores (Lojas)

#### POST /stores
Cria uma nova loja.
```json
{
  "name": "Loja do João",
  "userId": 1
}
```

#### GET /stores
Lista todas as lojas (inclui usuário dono e produtos).

#### GET /stores/:id
Busca uma loja específica (inclui usuário dono e produtos).

#### PUT /stores/:id
Atualiza uma loja.
```json
{
  "name": "Nova Loja do João",
  "userId": 1
}
```

#### DELETE /stores/:id
Remove uma loja (e seus produtos em cascata).

### Products (Produtos)

#### POST /products
Cria um novo produto.
```json
{
  "name": "Smartphone",
  "price": 999.99,
  "storeId": 1
}
```

#### GET /products
Lista todos os produtos (inclui loja e dono da loja).

#### GET /products/:id
Busca um produto específico (inclui loja e dono da loja).

#### PUT /products/:id
Atualiza um produto.
```json
{
  "name": "Smartphone Pro",
  "price": 1299.99,
  "storeId": 1
}
```

#### DELETE /products/:id
Remove um produto.

## Funcionalidades Implementadas

✅ **CRUD Completo**: Todas as tabelas possuem operações Create, Read, Update e Delete  
✅ **Relacionamentos**: Implementados relacionamentos 1:1 e 1:N com Prisma  
✅ **Include**: Consultas trazem dados relacionados usando `include`  
✅ **Validações**: Tratamento de erros e validações de integridade  
✅ **Cascata**: Deleções em cascata configuradas no schema  

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Gerar cliente após mudanças no schema
npx prisma generate

# Aplicar mudanças no banco (AlwaysData)
npx prisma db push

# Visualizar banco de dados
npx prisma studio
```

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM e gerenciador de banco
- **MySQL** - Banco de dados
- **dotenv** - Gerenciamento de variáveis de ambiente
# GreenCode — API de Gestão de Resíduos Eletrônicos

API REST desenvolvida em TypeScript para gerenciamento do recebimento, triagem, desmontagem e rastreabilidade de equipamentos eletrônicos.

Projeto desenvolvido como parte da Avaliação 2 (AV2) da disciplina de Técnicas de Programação.

## Tecnologias utilizadas

- **Node.js** — ambiente de execução
- **TypeScript** — linguagem de programação
- **Fastify 5** — framework HTTP
- **PostgreSQL** — banco de dados relacional
- **Prisma ORM 7** — persistência e gerenciamento do banco de dados
- **JWT** — autenticação e autorização
- **Swagger / OpenAPI** — documentação interativa da API

## Funcionalidades

O sistema disponibiliza:

- Autenticação de usuários com JWT.
- Controle de acesso baseado em papéis.
- Cadastro e gerenciamento de usuários.
- Bloqueio e desbloqueio de usuários.
- Cadastro e gerenciamento de organizações.
- Cadastro e gerenciamento de contratos.
- Cadastro e gerenciamento de lotes.
- Cadastro e gerenciamento de equipamentos.
- Registro e consulta do histórico de movimentações.
- Controle dos estados dos equipamentos.
- Concorrência otimista para evitar alterações conflitantes.
- Transações para garantir a integridade das movimentações.
- Verificação da disponibilidade da API e do banco de dados.

## Arquitetura

O projeto utiliza uma arquitetura em camadas, separando as responsabilidades da aplicação:

| Camada | Responsabilidade |
| --- | --- |
| Routes | Definição dos endpoints HTTP |
| Controllers | Recebimento das requisições e envio das respostas |
| Services | Regras de negócio e validações |
| Repositories | Acesso e persistência dos dados |
| Middlewares | Autenticação e controle de permissões |
| Schemas | Validação e documentação dos contratos HTTP |

O Prisma ORM é responsável pela comunicação com o PostgreSQL.

## Modelo de dados

O banco de dados possui seis entidades principais:

- **Usuario:** usuários do sistema, credenciais e permissões.
- **Organizacao:** organizações responsáveis pelo envio de resíduos eletrônicos.
- **Contrato:** contratos vinculados às organizações.
- **Lote:** conjuntos de equipamentos recebidos de uma organização.
- **Equipamento:** equipamentos eletrônicos e seus estados de processamento.
- **Movimentacao:** histórico das mudanças de estado de cada equipamento.

### Relacionamentos

- Uma organização pode possuir um contrato.
- Uma organização pode possuir vários lotes.
- Um lote pode possuir vários equipamentos.
- Um equipamento pode possuir várias movimentações.

## Estados dos equipamentos

Os equipamentos percorrem os seguintes estados:

1. `RECEBIDO`
2. `EM_TRIAGEM`
3. `TRIADO`
4. `EM_DESMONTAGEM`
5. `DESMONTADO`

As mudanças de estado são registradas no histórico de movimentações, permitindo acompanhar o processamento de cada equipamento.

## Autenticação e permissões

A autenticação utiliza JSON Web Tokens (JWT).

Os usuários podem possuir os seguintes papéis:

| Papel | Descrição |
| --- | --- |
| `ADMINISTRADOR` | Administração do sistema e gerenciamento de usuários |
| `OPERADOR_CADASTRO` | Operações de cadastro conforme as permissões definidas |
| `GESTOR_ALMOXARIFADO` | Gerenciamento operacional dos equipamentos |
| `AUDITOR` | Consulta e auditoria das informações |

As permissões são verificadas pelo backend antes da execução das operações protegidas.

## Concorrência otimista

As entidades possuem um campo `versao`, utilizado para controlar alterações concorrentes.

Nas operações que exigem controle de concorrência, o cliente informa `versaoEsperada`.

Se a versão informada não corresponder à versão atual do registro, a API retorna:

```http
HTTP 409 — Conflict
```

Esse mecanismo evita que uma atualização sobrescreva alterações realizadas anteriormente por outro usuário.

## Transações

As movimentações dos equipamentos utilizam transações do Prisma.

A atualização do estado do equipamento e a criação do registro de movimentação são realizadas atomicamente.

Se uma das operações falhar, a transação é revertida, preservando a consistência dos dados.

## Pré-requisitos

Para executar o projeto, é necessário instalar:

- Node.js e npm
- PostgreSQL
- Git

O projeto foi desenvolvido para execução em ambientes Windows e Linux.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/pedroprdgs/AV2-TP.git
```

Acesse o diretório:

```bash
cd AV2-TP
```

Instale as dependências:

```bash
npm install
```

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como referência.

Configure a conexão com o PostgreSQL, o segredo JWT e as credenciais do administrador inicial.

Exemplo:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/greencode?schema=public"

JWT_SECRET="substitua-por-uma-chave-segura-com-pelo-menos-32-caracteres"

SEED_ADMIN_USUARIO="admin"
SEED_ADMIN_SENHA="defina-uma-senha-segura"
SEED_ADMIN_NOME="Administrador"
```

Crie previamente o banco de dados `greencode` no PostgreSQL ou ajuste a URL de conexão para utilizar outro banco.

**Importante:** não compartilhe o arquivo `.env` nem inclua senhas ou chaves reais no repositório.

## Banco de dados

### Aplicar as migrations

Com o PostgreSQL em execução e as variáveis de ambiente configuradas:

```bash
npx prisma migrate deploy
```

### Gerar o Prisma Client

```bash
npx prisma generate
```

### Executar o seed

```bash
npm run db:seed
```

O seed cria:

- Um administrador inicial, configurado por variáveis de ambiente.
- Duas organizações fictícias.
- Dois contratos.
- Dois lotes.
- Cinco equipamentos.
- Dez movimentações de exemplo.

O seed foi desenvolvido para permitir múltiplas execuções sem duplicar os registros de demonstração.

### Visualizar os dados

Para inspecionar o banco de dados:

```bash
npx prisma studio
```

## Executando a aplicação

Inicie a API utilizando o script de desenvolvimento configurado no `package.json`:

```bash
npm run dev
```

A porta utilizada depende da configuração do servidor.

## Documentação da API

A API possui documentação interativa utilizando Swagger e OpenAPI.

Com o servidor em execução, acesse:

```text
http://localhost:PORTA/docs
```

Substitua `PORTA` pela porta configurada na aplicação.

O Swagger permite consultar os endpoints, visualizar os schemas de requisição e resposta e realizar testes diretamente pela interface.

Para testar endpoints protegidos:

1. Execute o login com um usuário válido.
2. Copie o token JWT retornado.
3. Clique em **Authorize** no Swagger.
4. Informe o token.
5. Execute as operações permitidas para o papel do usuário.

## Principais endpoints

| Método | Endpoint | Descrição |
| --- | --- | --- |
| POST | `/auth/login` | Autenticar usuário |
| POST | `/auth/logout` | Encerrar sessão |
| GET | `/usuarios` | Listar usuários |
| POST | `/usuarios` | Cadastrar usuário |
| GET | `/organizacoes` | Listar organizações |
| POST | `/organizacoes` | Cadastrar organização |
| GET | `/contratos` | Listar contratos |
| POST | `/contratos` | Cadastrar contrato |
| GET | `/lotes` | Listar lotes |
| POST | `/lotes` | Cadastrar lote |
| GET | `/equipamentos` | Listar equipamentos |
| POST | `/equipamentos` | Cadastrar equipamento |
| GET | `/equipamentos/:equipamentoId/movimentacoes` | Consultar histórico |
| POST | `/equipamentos/:equipamentoId/movimentacoes` | Registrar movimentação |
| GET | `/health` | Verificar disponibilidade da API |
| GET | `/health/db` | Verificar conexão com PostgreSQL |

A relação completa de endpoints, parâmetros e respostas está disponível no Swagger.

## Verificação de saúde

### GET `/health`

Verifica se o servidor HTTP está funcionando.

Resposta esperada:

```json
{
  "status": "ok",
  "message": "API GreenCode funcionando"
}
```

### GET `/health/db`

Verifica a conectividade com o PostgreSQL.

Requer autenticação com papel `ADMINISTRADOR`.

Resposta em caso de sucesso:

```json
{
  "status": "ok",
  "database": "connected"
}
```

Caso o banco esteja indisponível, a API retorna HTTP `503`.

## Tratamento de erros

A aplicação possui tratamento centralizado de erros, incluindo erros de validação, autenticação, autorização, recursos inexistentes e conflitos de concorrência.

Os códigos HTTP utilizados seguem o resultado de cada operação, incluindo respostas de sucesso e erro.

## Encerramento da aplicação

A aplicação possui um hook de encerramento (`onClose`) responsável por desconectar o Prisma Client.

Isso permite liberar as conexões com o banco de dados durante o desligamento do servidor.

## Autor

Pedro Pereira Rodrigues

GitHub: [pedroprdgs](https://github.com/pedroprdgs)

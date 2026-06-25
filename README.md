# Ouvidoria Pública Municipal — API

API RESTful para gestão de manifestações públicas (reclamações, denúncias, sugestões, solicitações, dúvidas e elogios) em um órgão municipal, com classificação automática por Inteligência Artificial e rastreabilidade completa de atendimento.

## O problema que resolve

Como Assessor Técnico na Prefeitura Municipal de Paulista, atuo diretamente com monitoramento de dados públicos, relatórios estatísticos e o Portal da Transparência do município. Essa vivência revelou um gargalo recorrente em ouvidorias públicas: manifestações chegam em linguagem informal e desorganizada, exigindo triagem manual demorada antes de serem encaminhadas ao setor responsável.

Este projeto resolve esse problema automatizando a triagem: o cidadão escreve livremente, e o sistema classifica a categoria, define a secretaria responsável, avalia a prioridade e formaliza o texto — tudo automaticamente, preservando o relato original para fins de auditoria.

## Funcionalidades

- **Cadastro e consulta de manifestações**, com protocolo único gerado automaticamente
- **Classificação automática por IA** (Google Gemini): categoria, secretaria responsável, prioridade e formalização institucional do texto, a partir do relato livre do cidadão
- **Cálculo automático de prazo legal** de resposta, seguindo a Lei de Acesso à Informação (20 dias)
- **Autenticação de servidores** com JWT e senhas protegidas por hash (bcrypt)
- **Histórico de auditoria**: cada mudança de status é registrada com responsável, data e hora
- **Validação de dados** em todas as entradas, com mensagens de erro claras
- **Testes unitários** das regras de negócio centrais

## Tecnologias

- **Node.js** + **Express**
- **PostgreSQL** + **Prisma ORM**
- **JWT** + **bcrypt** para autenticação
- **Zod** para validação de dados
- **Google Gemini API** para classificação automática
- **Jest** para testes unitários
- **Docker** + **Docker Compose** para containerização
- **Git** com Conventional Commits

## Arquitetura

O projeto segue separação em camadas, isolando responsabilidades:

```
src/
├── routes/         → definição dos endpoints
├── controllers/    → recebimento de requisições e respostas HTTP
├── services/       → regras de negócio e acesso a dados
├── validations/    → schemas de validação (Zod)
├── middlewares/    → autenticação e proteção de rotas
└── __tests__/      → testes unitários
```

## Como rodar o projeto

### Com Docker (recomendado)

Pré-requisitos: Docker e Docker Compose instalados.

```bash
git clone https://github.com/B00rges/ouvidoria-api.git
cd ouvidoria-api
cp .env.example .env   # preencher JWT_SECRET e GEMINI_API_KEY
docker-compose up --build
```

Em outro terminal, sincronize o banco:

```bash
docker-compose exec api npx prisma db push
```

A API estará disponível em `http://localhost:3000`.

### Sem Docker

Pré-requisitos: Node.js 20+, PostgreSQL.

```bash
npm install
npx prisma db push
npm run dev
```

### Executando os testes

```bash
npm test
```

## Endpoints principais

| Método | Rota                              | Descrição                                  | Autenticação |
|--------|------------------------------------|---------------------------------------------|--------------|
| POST   | `/manifestacoes`                  | Cria manifestação (com classificação por IA) | Não          |
| GET    | `/manifestacoes`                  | Lista todas as manifestações                 | Não          |
| GET    | `/manifestacoes/:id`              | Busca manifestação por ID                    | Não          |
| GET    | `/manifestacoes/:id/historico`    | Histórico de mudanças de status              | Sim          |
| PUT    | `/manifestacoes/:id/status`       | Atualiza status                              | Sim          |
| POST   | `/usuarios`                       | Cadastra servidor                            | Não          |
| POST   | `/usuarios/login`                 | Autentica e retorna token JWT                | Não          |
| GET    | `/usuarios`                       | Lista servidores cadastrados                 | Sim          |

## Decisões técnicas

- **Separação em camadas (routes/controllers/services):** garante que regras de negócio fiquem isoladas e testáveis, independente da camada HTTP.
- **Soft status em vez de exclusão real:** manifestações nunca são apagadas, apenas movidas para o status `ARQUIVADO`, preservando histórico para fins de transparência pública.
- **Histórico em tabela própria (`HistoricoStatus`):** cada mudança de status gera um registro de auditoria com responsável e timestamp, em vez de sobrescrever apenas o estado atual.
- **Resiliência na integração com IA:** se a chamada à API do Gemini falhar, a manifestação ainda é criada normalmente, usando os dados informados como fallback — a disponibilidade do sistema nunca depende da IA.
- **`db push` em vez de `migrate dev`:** usado como alternativa a uma instabilidade conhecida do Prisma 6/7 com bancos locais no Windows, documentando a limitação como decisão consciente.
- **Funções de lógica de negócio extraídas e testadas isoladamente** (`calcularDataLimite`, `statusMudou`), separadas das chamadas ao banco, para permitir testes unitários sem necessidade de mocks complexos.

## Autor

**Wesley Charles Borges Câmara**
[GitHub](https://github.com/B00rges) · [LinkedIn](https://www.linkedin.com/in/wesley-charles-522b6a264/)
---
title: Criando nosso primeiro serviço GraphQL
date: 2020-11-12
description: Agora que já sabemos o básico sobre GraphQL vamos começar nossa
  aplicação e nos aprofundar um pouco mais em assuntos mais técnicos.
cover: images/apollo-server.png
---

## O que é um serviço GraphQL

Antes de continuar vamos falar um pouco sobre o que define um serviço GraphQL e como podemos começar nossa implementaçao.

Podemos dizer que um serviço em GraphQL é uma aplicação que roda no backend e essa aplicação valida e executa nossas consultas.

Quando uma consulta é recebida o serviço faz uma validação para verificar que a consulta faz referência apenas para os tipos definidos no *schema* então executa as funções que resolvem aqueles dados.

Dividimos em duas partes: a criação do **schema** e as funções chamamos de **resolvers**, onde no schema criamos os tipos que a especificação do GraphQL nos fornece e nos resolvers temos funções que lidam em como esses dados serão armazenados e retornados.

Bem, agora vamos falar um pouco sobre a nossa aplicação (até que enfim).

## Stack
Sobre a stack da nossa aplicação, vamos fazer tudo usando o queridinho JS, mas lembre-se que o GraphQL é agnóstico a linguagem então você pode usar qualquer coisa, eu particularmente tenho muito mais afinidade com JS.

Pra implementação do backend eu decidi utilizar TypeScript, mas não é obrigatório e você consegue seguir os passos aqui usando apenas JavaScript, mas qualquer dúvida você pode me chamar no [twitter](https://twitter.com/uselessdevelop), como framework eu vou utilizar o [Apollo (que é uma solução fullstack)](https://www.apollographql.com/) pois ele facilita bastante fornecendo várias ferramentas como healthcheck e ferramentas pra facilar os testes.

## Começando

**obs:** [você pode clonar o repositório aqui](https://github.com/uselessdev/bookr)

Vamos criar a pasta da nossa aplicação e instalar nossas primeiras dependencias:

```bash
mkdir bookr; & cd $_ # isso vai criar e entrar na pasta bookr
yarn add graphql apollo-server dotenv
yarn add -D nodemon typescript ts-node @types/node
```

Como vamos usar typescript vamos criar nossa configuração e definir algumas regras para o compilador:

```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "dist",

    "strict": true,

    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noFallthroughCasesInSwitch": true,

    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

    "baseUrl": "./",
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

[Aqui você pode ver o que cada opção faz](https://www.typescriptlang.org/pt/tsconfig)

Nosso `package.json`


```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node --files src/index.ts"
  },
  "dependencies": {
    "apollo-server": "^2.19.0",
    "dotenv": "^8.2.0",
    "graphql": "^15.4.0"
  },
  "devDependencies": {
    "@types/node": "^14.14.7",
    "nodemon": "^2.0.6",
    "ts-node": "^9.0.0",
    "typescript": "^4.0.5"
  }
}

```

Quando usamos typescript teremos um passo a mais no processo de deploy que é build da aplicação pra transformar o **.ts** em **.js**, mas neste momento não vamos nos preocupar com isso.

Por último vamos criar nosso arquivo `src/index.ts`

```typescript
import { ApolloServer, gql } from 'apollo-server'

const typeDefs = gql`
  type Query {
    greet: String
  }
`

const resolvers = {
  Query: {
    greet: () => `Hello World!`
  }
}

const app = new ApolloServer({
  typeDefs,
  resolvers,
})

app.listen(4000).then(() => {
  console.log(`running at port 4000`)
})
```

Agora no seu terminal você pode executar

```bash
yarn dev
```

Você deve ver algo assim

![imagem do script yarn dev executando em um terminal](/upload/criando-uma-aplicacao-graphql-fullstack/01.png)

E acessando o navegador no endereço: http://localhost:4000

![imagem do playground do graphql no navegador](/upload/criando-uma-aplicacao-graphql-fullstack/02.png)

Bem aqui nós acabamos nosso hello world, mas antes de continuar vamos voltar a falar um pouco mais sobre o GraphQL.

## Um pouco mais de GraphQL

Como falamos lá no inicio do artigo, sobre termos nosso *schema* e *resolvers*, no nosso hello world nós criamos nosso *schema* quando definimos o `typeDefs`:

```typescript
const typeDefs = gql`
  type Query {
    greet: String
  }
`
```

Aqui nós podemos ver algumas coisas: estamos criando um tipo `Query` e então criamos um campo `greet` que é do tipo `String`, isto é o nosso **SDL (schema definition language)** e é isso que garante que o GraphQL seja agnostivo a linguagem de programação pois o SDL será sempre o mesmo.

Vamos entender melhor como funciona a definição do **schema**.

## Object Types e Fields.

**Object Types** são objetos que representam um objeto de dados com os campos e seus tipos definidos, por exemplo pra criar uma representação de livos podemos escrever da seguinte da forma:

```graphql
const typeDefs = gql`
  type Book {
    id: ID!
    title: String
    release: Int
    author: ID
    readed: Boolean
  }

  type Query {
    greet: String
    books: [Book]
  }
`
```

Olhando pra esse tipo podemos afirmar que: `Book` é nosso Object Type, ele descreve um objeto que deverá ser retornado por uma API, e este tipo também descreve alguns campos e seus tipos, `id`, `title`, `release`, `author` e `readed`

Em cada campo podemos ver os tipos que esperamos receber, temos: `ID!`, `String`, `Int`, `ID` e `Boolean`, esses tipos são chamados de tipos escalares *(scalar types)*, o GraphQL nos fornece os seguintes tipos: `Int`, `Float`, `String`, `Boolean` e `ID`

Em execessão do `ID` todos os campos representam seus respectivos nome (Int representa um número inteiro e etc.)

O `ID` é a representação de um identificador único ele é usado normalmente para a realização de `refetch` e chave para cache de dados.

Por padrão, todo campo que não retorna um valor o graphql retorna ele como `null` se existir na consulta, porém, a presença de um ponto de exclamação `!` no campo de id diz que aquele campo é obrigatório e ele não pode ser retornado como `null`.

Como não criamos uma função para resolver o tipo Book se tentarmos recuperar este valor teremos um retorno da seguinte forma:

```json
{
  "data": {
    "book": null
  }
}
```

![imagem do playground com retorno nulo porque ainda não resolvemos o campo book](/upload/criando-uma-aplicacao-graphql-fullstack/03.png)

Então vamos criar o resolver pro nosso tipo Book:

```typescript
const resolvers = {
  Query: {
    greet: () => `Hello World!`,
    book: () => ({
      title: 'Fundação',
      author: 'Isaac Asimov'
    })
  }
}
```

Nota que não criamos uma chave para `Book` mas sim adicionamos uma chave `book` dentro de `Query` isso porque o que queremos resolver está no tipo `Query` agora no playground, vamos refazer nossa operação de query.

Agora ao refazermos a operação teremos o nome do livro

```json
{
  "data": {
    "book": "Fundação"
  }
}
```

![imagem do playground com retorno válido com o nome do livro](/upload/criando-uma-aplicacao-graphql-fullstack/04.png)

Quando definimos nosso esquema nós dizemos que o campo id do tipo Book é um campo obrigatório usando o ponto de exclamação, porém no resolver não retornamos este campo ou seja o valor dele seria `nulo`, mas como ele é obrigatório teremos um erro ao tentar fazer a operação como você pode conferir na imagem abaixo.

![imagem do playground com retorno válido com o nome do livro](/upload/criando-uma-aplicacao-graphql-fullstack/05.png)

Pra resolver este problema, nós precisamos retornar algum valor para o ID no nosso resolver, mas faremos isso mais pra frente.

---
title: Criando nosso primeiro schema e adicionando Autores
date: 2020-12-09
description: Vamos começar a criar nosso primeiro schema e adicionar nossos autores.
cover: images/apollo-server.png
---

## Configuração de testes.
Antes de começar a criar nosso *schema* vamos configurar nossa aplicação para escrever testes, se você está escrevendo sua aplicação seguindo este passo a passo [as configurações que eu fiz estão neste commit](https://github.com/uselessdev/bookr/commit/ebf969641edc039261c8ec1b63c46096eb14e86d), porém se você não está seguindo, mas mesmo assim quer dar uma olhada, o código está na branch principal *main* do repositório também.

## Schema.
Sobre a nossa aplicação queremos construir algo que vai listar livros, e será possivel marcar se leu ou não o livro e também poderá adicionar reviews sobre o mesmo.

Pensando nisso, nós teriamos as seguintes entidades: `Livro`, `Review`, `Pessoa`, como nossos livros podem ter autores, vamos criar também `Autores`.

Agora podemos começar a escrever nosso *schema*, dentro da pasta `src` vamos criar um arquivo `schema.ts`, começando pelos autores vamos adicionar o seguinte:

```typescript
import { gql } from "apollo-server"

export const typeDefs = gql`
  type Author {
    id: ID!
    name: String
  }

  type Query {
    authors: [Author]
  }
`
```

Aqui nós criamos o tipo **Author** com os campos *id*, e *name* e logo em seguida definimos no tipo **Query** um campo *authors* que retorna um `[Author]`, isso que dizer que quando realizarmos uma consulta para *authors* nós receberemos uma lista (ou array) de autores.

Note que `Query` é um tipo especial no graphql, este tipo é nosso ponto de entrada pra aplicação, **todo serviço GraphQL** implementa o tipo *Query*, além dele também podemos ter `Mutation` e `Subscription` falaremos deles mais pra frente.

## Nosso primeiro teste.
Pra de fato testar nossa aplicação, nós precisamos de algum meio de realizar consultas pra nossa aplicação, quando estamos construindo uma aplicação REST podemos utilizar algumas libs pra criar um servidor que execute apenas no momento do teste, como o [supertest](https://github.com/visionmedia/supertest) e assim conseguirmos realizar as consultas, no caso do apollo-server podemos usar uma biblioteca chamada [apollo-server-testing](https://www.npmjs.com/package/apollo-server-testing) que faz exatemnte a mesma coisa, isso vai ser o suficiente para escrevermos nossos testes por enquanto.

Vamos primeiro fazer uma mudança na estrutura da nossa aplicação, dentro de `src` crie um arquivo `server.ts` e adicione o seguinte:

```typescript
import { ApolloServer, gql } from 'apollo-server'

const typeDefs = gql`
  type Book {
    id: ID!
    title: String
    # release year
    release: Int
    author: ID
  }

  type Query {
    greet: String
    book: Book
  }
`

const resolvers = {
  Query: {
    greet: () => `Hello World!`,
    book: () => ({
      title: 'Fundação',
      author: 'Isaac Asimov'
    })
  }
}

export const server = new ApolloServer({
  typeDefs,
  resolvers,
})

export function Start() {
  server.listen(4000)
}

```

Nosso `index.ts` deve ficar da seguinte forma:

```typescript
import { Start } from "./server";

Start();
```

Assim separamos a responsabilidade de iniciar o server e a configuração do mesmo, então quando formos rodar o teste, não teremos nenhum problema de tentar executar algum código que está fora do contexto do teste.

Agora vamos adicionar a biblioteca pra conseguirmos testar nossa aplicação, no seu terminal: `yarn add -D apollo-server-testing`, após isso vamos criar na raiz do projeto **(não na src)** uma pasta `tests` e dentro dela adicionamos: `authors.spec.ts` que deve ter o seguinte conteúdo:

```typescript
import { createTestClient } from "apollo-server-testing";
import { server } from "../src/server";

const { query } = createTestClient(server);

const QUERY_FETCH_AUTHORS = `
  query fetchAuthors {
    authors {
      id
      name
    }
  }
`;

// Se você não estiver usando typescript, você não precisa disso.
type FetchAuthorsQuery = {
  authors?: Array<{
    id: string;
    name: string;
  }>;
};

test("deve retornar uma lista de autores vazia", async () => {
  // se você não estiver usando typescript, aqui você pode remover <FetchAuthorsQuery>
  const { data } = await query<FetchAuthorsQuery>({
    query: QUERY_FETCH_AUTHORS,
  });
  expect(data?.authors).toStrictEqual([]);
});
```

Se rodarmos nosso teste `yarn test` ele vai falhar, porque ainda não temos nada relacionado aos autores na nossa aplicação.

## Resolvers
Agora, vamos criar nosso arquivo de resolvers em src mesmo:

```typescript
// src/resolvers.ts
export const resolvers = {
  Query: {
    authors: () => []
  }
}
```

Aqui nosso campo authors, é uma função que retorna apenas um array vazio pois ainda não temos autores.

E nosso `server.ts` deve ficar assim:

```typescript
import { ApolloServer } from 'apollo-server'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'

export const server = new ApolloServer({
  typeDefs,
  resolvers,
})

export function Start() {
  server.listen(4000)
}
```

Se rodarmos nosso teste novamente, vamos obter o seguinte resultado:

![imagem do com o resultado dos testes](/upload/criando-uma-aplicacao-graphql-fullstack/07.png)

Executando nossa aplicação com `yarn dev` e visitando nosso localhost, se fizermos a consulta:

```json
{
  authors {
    id
    name
  }
}
```

Receberemos o seguinte resultado:

```json
{
  "data": {
    "authors": []
  }
}
```

## Fake it
Vamos adicionar alguns dados ficticios, em `src` vamos adicionar uma pasta **data** com um arquivo `authors.ts` dentro e neste arquivo, vamos adicionar o seguinte:

```typescript
export default [
  { id: 1, name: 'Cornelia Funke' },
  { id: 2, name: 'Isaac Asimov' },
]
```

## Refatorando algumas coisas
Começando pelo nosso arquivo de teste:

```typescript
import { createTestClient } from "apollo-server-testing";
import { server } from "../src/server";

const { query } = createTestClient(server);

const QUERY_FETCH_AUTHORS = `
  query fetchAuthors {
    authors {
      id
      name
    }
  }
`;

type Author = {
  id: string
  name: string
}

type FetchAuthorsQuery = {
  authors?: Author[];
};

test("deve retornar uma lista de autores vazia", async () => {
  const { data } = await query<FetchAuthorsQuery>({
    query: QUERY_FETCH_AUTHORS,
  });
  expect(data?.authors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "Cornelia Funke" }),
      expect.objectContaining({ name: 'Isaac Asimov' }),
    ])
  );
});
```

Estamos esperando que o `data.authors` seja uma lista contendo pelo menos dois objetos, e cada um deles tenha uma propriedade `name` com os devidos valores, ainda neste arquivo de teste, vamos adicionar o teste para um autor apenas:

```typescript
import { createTestClient } from "apollo-server-testing";
import { server } from "../src/server";

const { query } = createTestClient(server);

const QUERY_FETCH_AUTHORS = `
  query fetchAuthors {
    authors {
      id
      name
    }
  }
`;

const QUERY_FETCH_AUTHOR = `
  query fetchAuthor($id: ID!) {
    author(id: $id) {
      id
      name
    }
  }
`;

type Author = {
  id: string;
  name: string;
};

type FetchAuthorsQuery = {
  authors?: Author[];
};

type FetchAuthorQuery = {
  author?: Author;
};

test("deve retornar uma lista de autores vazia", async () => {
  const { data } = await query<FetchAuthorsQuery>({
    query: QUERY_FETCH_AUTHORS,
  });
  expect(data?.authors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "Cornelia Funke" }),
      expect.objectContaining({ name: "Isaac Asimov" }),
    ])
  );
});

test("deve retornar um autor apenas", async () => {
  const { data } = await query<FetchAuthorQuery>({
    query: QUERY_FETCH_AUTHOR,
    variables: { id: "1" },
  });

  expect(data?.author).toMatchObject({ name: "Cornelia Funke" });
});
```

Agora no nosso `src/resolvers.ts`

```typescript
import authors from "./data/authors";

export const resolvers = {
  Query: {
    authors: () => authors,
  },
};
```

## Argumentos
Agora, vamos falar sobre como fazemos para buscar um autor específico, quando escrevemos nosso schema, podemos criar campos que recebem argumentos, esses argumentos também recebem um tipo, nós ainda podemos acessar esses tipos nas nossas funções de resolvers, vamos ver como fazer isso.

No nosso `schema`:

```typescript
import { gql } from "apollo-server";

export const typeDefs = gql`
  type Author {
    id: ID!
    name: String
  }

  type Query {
    authors: [Author]
    author(id: ID!): Author
  }
`;
```

No nosso tipo Query, nós adicionamos o campo `author` e também adicionamos um argumento `id` que é do tipo `ID` e é obrigatório, esse campo deve resolver pra um tipo `Author`, vamos olhar como funciona uma função de resolver com apollo-server:

```js
function resolver (parent, args, context, info) {}
```

O primeiro argumento `parent` faz referência ao tipo pai, ou o que foi resolvido antes de chegar neste nível, vamos imaginar a seguinte consulta:

```graphql
query {
  books {
    title
    author {
      name
    }
  }
}
```

O graphql vai resolver isso na seguinte ordem:

![imagem do playground com retorno para a consulta de autores](/upload/criando-uma-aplicacao-graphql-fullstack/08.png)

Imaginando que nosso resolver de author seja resolvido com essa query o `parent` será o que está em `Book`, dito isso vamos alterar nosso `src/resolvers.ts` pra pegar apenas um autor:

```typescript
import authors from "./data/authors"

type Args = {
  id: string
};

export const resolvers = {
  Query: {
    authors: () => authors,
    // nós vamos tirar este any daqui em breve, mantenha a calma.
    author: (_parent: any, args: Args) =>
      authors.find((author) => author.id === args.id),
  },
}
```

Como sabemos que `authors` é sempre um array que possui um campo `id` fazemos apenas um `find`, eventualmente vamos alterar isso, quando colocarmos um banco de dados, agora rodando nossos testes teremos:

![imagem do playground com retorno para a consulta de autores](/upload/criando-uma-aplicacao-graphql-fullstack/09.png)

![nice](https://media.giphy.com/media/h3uCITmuLW8Cbaf67I/giphy.gif)

Nos próximos artigo falaremos sobre como criar, editar e excluir coisas com GraphQL, até a próxima.

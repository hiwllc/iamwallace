---
title: Criando, editando e excluindo autores.
date: 2020-12-23
description: Vamos continuar a escrever nosso schema mas dessa vez vamos criar,
  editar e excluir nossos autores.
cover: images/apollo-server.png
---

No nosso último artigo, nós começamos a escrever nosso schama e criamos nossos resolver para conseguir buscar dados de todos os autores e de um autor apenas, neste artigo nós vamos fazer a parte de edição e exclusão desses dados.

## Banco de dados e Docker.

Antes de continuar, como vamos começar a lidar com dados e usar apenas arrays acaba ficando básico demais, vou configurar um banco de dados pra nossa aplicação, no meu caso eu vou usar [MongoDB](https://www.mongodb.com/).

Pra configurar o banco eu vou usar o docker pra subir o mongo apenas em desenvolvimento, se isso não for uma opção para você, uma opção bacana seria o [Atlas](https://www.mongodb.com/cloud/atlas), mas lembre-se que usando um serviço externo seus testes tendem a ficar mais lentos e dependentes desse serviço.

As mudanças pra isso [estão neste commit](https://github.com/uselessdev/bookr/pull/4/commits/c6e2437586bd1fed223b2729b8ff6250d93b859a).

## Criando autores.
Agora que já temos nossa configurações de banco de dados vamos fazer a parte de adicionar nossos autores na aplicação, se você olhar na aplicação temos agora um arquivo chamado *datasource.ts* nele temos algumas funções.

## Testes.
Vamos começar atualizando nossos testes para lidar com o inicialização do banco de dados, na aplicação temos o arquivo `.jest/setup.ts` vamos adicionar o seguinte nele:

```ts
import { Database } from "../src/server";
import { connection } from "../src/database";

beforeAll(async () => {
  await Database();
});

afterAll(async () => {
  await connection.db.dropDatabase();
  await connection.close();
});
```

Isso vai garantir que antes de todos os testes, nós vamos iniciar a conexão com o banco de dados, e depois de executarmos todos os testes, vamos deletar nosso banco e fechar a conexão, agora vamos reescrever nosso arquivo de teste:

```ts
import { createTestClient } from "apollo-server-testing";
import { Author } from "../src/model";
import { server } from "../src/server";

const { mutate } = createTestClient(server);

const MUTATION_CREATE_AUTHOR = `
  mutation createAuthor($author: CreateAuthorInput!) {
    createAuthor(input: $author) {
      author {
        id
        name
      }
    }
  }
`;

type CreateAuthorResult = {
  createAuthor?: {
    author: Author;
  };
};

test("deve criar um autor e retornar os dados", async () => {
  const { data } = await mutate<
    CreateAuthorResult,
    { author: Pick<Author, "name"> }
  >({
    mutation: MUTATION_CREATE_AUTHOR,
    variables: { author: { name: "Cornelia Funke" } },
  });

  expect(data?.createAuthor?.author.name).toBe("Cornelia Funke");
});

test.todo("deve retornar uma lista com os autores");
test.todo("deve retornar um autor pelo id");
test.todo("deve editar e retornar os dados de um autor");
test.todo("deve excluir e retornar o id de um autor");
```

Vamos deixar ele assim por enquanto.

## Mutations.
Para que possamos criar nossos autores não podemos utilizar o tipo `Query` porque este tipo é de uso exclusivo para busca de dados é ai que entra o `Mutation` este tipo nos permite realizar operações 'destrutivas' (ações que causem mudançãs na nossa base de dados como criar, editar ou excluir dados por exemplo)

Então vamos começar a adicionando no nosso schema.ts o seguinte:

```ts
export typeDefs = gql`
  // as outras coisas que já existiam aqui.

  type Mutation {
    createAuthor(input: CreateAuthorInput!): CreateAuthorPayload
  }
`
```

Este tipo `Mutation` será nosso ponto de entrada para todas as operações que mudam nossos dados, tudo que tiver ai dentro vamos chamar de mutations, nossa primeira mutation será chamada de `createAuthor` essa mutation recebe um argumento `CreateAuthorInput` que é obrigatório e nos retorna um tipo `CreateAuthorPayload`, vamos falar desses dois:

## Input Types.
Quando estávamos criando nossas `queries` nosso argumentos poderiam ser quaisquer tipo escalar fornecidos pelo GraphQL, porém quando precisamos passar um objeto como argumento precisamos usar o tipo `input`, ele é exatamente a mesma coisa que um *object type* porém seu uso é exclusivo para argumentos.

Vamos criar nosso `CreateAuthorInput` ainda no schema.ts:

```ts
export typeDefs = gql`
  // as outras coisas que já existiam aqui.

  input CreateAuthorInput {
    name: String!
  }

  type Mutation {
    createAuthor(input: CreateAuthorInput!): CreateAuthorPayload
  }
`
```

## Payload.

> Na computação, payload refere-se à carga de uma transmissão de dados. É a parte principal dos dados transmitidos, da qual se excluem as informações utilizadas para facilitar a entrega, como cabeçalhos e metadados que podem conter, por exemplo, a identificação da fonte e do destino dos dados. [wikipedia](https://pt.wikipedia.org/wiki/Payload)

Vamos falar do nosso payload de retorno, nada nos impede que nossa mutation nos retornasse apenas o **Author** criado, dessa forma:

```ts
//...
createAuthor(input: CreateAuthorInput!): Author
//...
```

Porém, caso exista a necessidade de adicionar algum valor nesse retorno que não fosse específico do `Author`?

No GraphQL o conceito de versionamento de API é um pouco diferente do que em uma aplicação REST, a filosofia do GraphQL é de evoluir sua aplicação então você não cria uma versão nova, você evolui de acordo com a necessidade do projeto.

Então uma boa prática é sem lidar com os dados das mutations de uma forma que fique fácil de você mudar estes dados sem causar problemas nas aplicações que irão consumir estes dados.

Dito isso, vamos escrever nosso `CreateAuthorPayload`

```ts
export typeDefs = gql`
  // as outras coisas que já existiam aqui.

  input CreateAuthorInput {
    name: String
  }

  type CreateAuthorPayload {
    author: Author
  }

  type Mutation {
    createAuthor(input: CreateAuthorInput!): CreateAuthorPayload
  }
`
```

Dessa forma, se precisarmos adicionar alguma coisa no nosso payload podemos facilmente adicionar um campo sem necessariamente alterar os dados do author.

## Resolvers

Agora que já fizemos a parte do schema vamos ao nosso resolver, então lá nosso resolver.ts vamos adicionar o seguinte:

```ts
// 1. Vamos importar nosso model e datasource
import { create } from "./datasource";
import { Author } from "./model";

// 2. Criamos o tipo pata os argumentos
type AuthorInput = {
  input: Author;
};

export const resolvers = {
  // coisas que já existiam antes continuam aqui

  // 3. Adicionamos nossa mutation.
  Mutation: {
    createAuthor: (_parent: any, args: AuthorInput) => {
      return create(args.input);
    },
  },
}
```

Agora nós podemos executar a seguinte operação no playground:

```graphql
mutation {
  createAuthor(input: { name: "Cornelia Funke" }) {
    author {
      id
      name
    }
  }
}
```

E nosso resultado deverá ser algo parecido com isso:

![imagem do playground com o retorno para a criação de um novo autor](/upload/criando-uma-aplicacao-graphql-fullstack/10.png)

<!-- Nesse input nós definimos que o ID é obrigatório, pois precisaremos saber qual vai ser o autor que precisaremos editar. -->

## Refatorando as coisas.
Antes pra buscar nossos dados, nós estavamos trazendo dados de um array local, mas agora que temos nosso banco de dados, vamos alterar nosso resolver pra buscar os dados que estão no banco de dados, vamos começar fazendo o teste para recuperar todos os autores e um autor especifico pelo id:

```ts
import { createTestClient } from "apollo-server-testing";
import { Author } from "../src/model";
import { server } from "../src/server";

const { mutate, query } = createTestClient(server);

const MUTATION_CREATE_AUTHOR = `
  mutation createAuthor($author: CreateAuthorInput!) {
    createAuthor(input: $author) {
      author {
        id
        name
      }
    }
  }
`;

const QUERY_FETCH_AUTHORS = `
  query fetchAuthors {
    authors {
      name
    }
  }
`;

const QUERY_FETCH_AUTHOR = `
  query fetchAuthor($id: ID!) {
    author(id: $id) {
      name
    }
  }
`;

type CreateAuthorResult = {
  createAuthor?: {
    author: Author;
  };
};

type FetchAuthorsResult = {
  authors?: Author[];
};

type FetchAuthorResult = {
  author?: Author;
};

let authorId: string;

test("deve criar um autor e retornar os dados", async () => {
  const { data } = await mutate<
    CreateAuthorResult,
    { author: Pick<Author, "name"> }
  >({
    mutation: MUTATION_CREATE_AUTHOR,
    variables: { author: { name: "Cornelia Funke" } },
  });

  // aqui nós precisaremos do id nos próximos testes
  authorId = data?.createAuthor?.author.id as string;

  expect(data?.createAuthor?.author.name).toBe("Cornelia Funke");
});

test("deve retornar uma lista com os autores", async () => {
  const { data } = await query<FetchAuthorsResult>({
    query: QUERY_FETCH_AUTHORS,
  });

  expect(data?.authors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "Cornelia Funke" }),
    ])
  );
});

test("deve retornar um autor pelo id", async () => {
  const { data } = await query<FetchAuthorResult>({
    query: QUERY_FETCH_AUTHOR,
    variables: { id: authorId },
  });
  expect(data?.author).toMatchObject({ name: "Cornelia Funke" });
});

test.todo("deve editar e retornar os dados de um autor");
test.todo("deve excluir e retornar o id de um autor");
```

agora podemos apagar a pasta `src/data` e logo depois alteramos nosso resolver.ts:

```ts
import { create, load, loader } from "./datasource";
import { Author } from "./model";

type Args = {
  id: string;
};

type AuthorInput = {
  input: Author;
};

export const resolvers = {
  Query: {
    authors: (_parent: any, args: any) => loader(args),
    author: (_parent: any, args: Args) => load({ id: args.id }),
  },

  Mutation: {
    createAuthor: (_parent: any, args: AuthorInput) => {
      return create(args.input);
    },
  },
};
```

## Editando autores.
Agora que nós já temos uma base sobre como *Mutation* funciona, vamos adicionar uma mutation para editar nossos autores, lembre-se dos passos, excrever os testes e fazer a implementação:

```ts
// 1. Adicionamos nossa mutation
const MUTATION_UPDATE_AUTHOR = `
  mutation updateAuthor($author: UpdateAuthorInput!) {
    updateAuthor(input: $author) {
      author {
        name
      }
    }
  }
`

// 2. Adicionamos o tipo
type UpdateAuthorResult = {
  updateAuthor?: {
    author: Author
  }
}

// 3. Escrevemos o teste
test("deve editar e retornar os dados de um autor", async () => {
  const { data } = await mutate<UpdateAuthorResult, { author: Author }>({
    mutation: MUTATION_UPDATE_AUTHOR,
    variables: { author: { id: authorId, name: "Douglas Adam" } },
  });

  expect(data?.updateAuthor?.author).toMatchObject({
    name: "Douglas Adam",
  });
});
```

Agora vamos, implementar começando lá pelo nosso schema:

```ts
export typeDefs = gql`
  //...

  input UpdateAuthorInput {
    id: ID!
    name: String
  }

  type UpdateAuthorPayload {
    author: Author
  }

  type Mutation {
    //...
    updateAuthor(input: UpdateAuthorInput!): UpdateAuthorPayload
  }
`
```

E agora nosso resolver:

```ts
// ...

type InputWithID = {
  input: { id: string } & Author;
};

export const resolvers = {
  // ...

  Mutation: {
    // ...

    updateAuthor: (_parent: any, args: InputWithID) => {
      return update(args.input);
    },
  },
};

```

Isso é o suficiente pra conseguirmos atualizar nossos autores.

## Excluindo autores.
E finalmente vamos fazer a parte de poder excluir um autor, como sempre, vamos começar pelo nosso teste depois schema e por fim resolver, só um detalhe, na operação de excluir nós vamos fazer um pouco diferente de antes.

```ts
const MUTATION_DELETE_AUTHOR = `
  mutation deleteAuthor($id: ID!) {
    deleteAuthor(id: $id) {
      author
    }
  }
`;

type DeleteAuthorResult = {
  deleteAuthor?: {
    author: string;
  }
};

test("deve excluir e retornar o id de um autor", async () => {
  const { data } = await mutate<DeleteAuthorResult, { id: string }>({
    mutation: MUTATION_DELETE_AUTHOR,
    variables: { id: authorId },
  });

  expect(data?.deleteAuthor?.author).toEqual(authorId);
});
```

Agora nossa *schema*:

```ts
export typeDefs = gql`
  // as outras coisas que já existiam aqui.

  type DeleteAuthorPayload {
    author: ID
  }

  type Mutation {
    // ...
    deleteAuthor(id: ID!): DeleteAuthorPayload
  }
`
```

Neste ponto nós podemos apenas passar o id do autor que queremos excluir e retornar o mesmo, se tudo ocorrer bem, rodando os testes o resultado deve ser como a imagem abaixo:

![resultado dos testes após criarmos o crud para autores](/upload/criando-uma-aplicacao-graphql-fullstack/11.png)

Bem, por enquanto é isso pessoal, nos próximos artigos nós vamos dar uma avançada e começar a adicionar o que falta da nossa aplicação (Livros, Usuários, Reviews), qualquer coisa me chamem no [twitter](https://twitter.com/uselessdevelop) *(minha DM é aberta)* e me mandem feedbacks.

Até a próxima.

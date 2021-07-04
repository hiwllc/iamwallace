---
title: Vamos Falar Sobre Datasources
date: 2021-01-21
description: Vamos refatorar nossa aplicação e falar um pouco sobre Datasources.
cover: images/apollo-server.png
---

No artigo anterior, nós fizemos toda a parte pra criar, editar, ler e excluir nossos dados de autores,
agora antes de avançar um pouco, vamos refatorar nossa aplicação e pensar em como podemos melhorar nossa
estrutura que fique menos complexo de escalar.

Atualmente, temos tudo na raiz de `src` o que eventualmente se torna bem chato de gerenciar então pensando
nisso a primeira coisa que faremos é mover tudo que for de autor para uma pasta especifica, então criamos `app/authors`
e movemos tudo relacionado para esta pasta.

Sendo mais especifico vamos mover os arquivos: `datasource.ts`, `model.ts`, `resolvers.ts` e `schema.ts`, vamos
precisar também criar um arquivo `index.ts` nessa pasta e vamos export o datasource, schema e resolvers:

```ts
export * as DataSource from "./datasource";
export * as AuthorsTypes from "./schema";
export * as AuthorsResolvers from "./resolvers";
```

No nosso `server.ts` vamos mudar a forma como importamos o schema e o resolvers de autores:

```ts
import { AuthorsTypes, AuthorsResolvers } from "./app/authors";

const typeDefs = [AuthorsTypes.typeDefs];

const resolvers = {
  ...AuthorsResolvers.resolvers
};

export const server = new ApolloServer({
  typeDefs,
  resolvers,
});
```

Até aqui tudo certo, mas vamos fazer uma pequena alteração em como lidamos em lidar com os dados
atualmente, nós temos um arquivo em `src/app/authors/datasource.ts` que é responsável por enviar
e buscar os dados de autores pro nosso model que se comunica com o banco de dados, então importamos
esse arquivo no nosso resolver até aqui, ok? ok.

Mas e se precisarmos utilizar esses mesmos em dados em outra parte da nossa aplicação, nós
poderiamos importar esse arquivo em outros módulos sem problemas, mas ai e se precisarmos em outra
parte da aplicação?

Bem, uma forma de resolver isso de uma forma simples é algo que o ApolloServer nos fornece: Data sources

> Data sources é especifico do Apollo Server e não do GraphQL exatamente, é uma implementação direta do
> framework, nada impede que você implemente o mesmo conceito em outros frameworks graphql.

## Criando nosso Data source.
Não foi por acaso que criamos nosso arquivo já com esse nome, assim deixamos explicitos, o que vamos fazer,
e como já temos nosso data source para autores, vamos só configurar o apollo pra lidar com eles.


Vamos criar mais um arquivo chamado `datasources.ts` dentro da pasta `src` com o seguinte conteúdo:

```ts
import { DataSources as GraphQLDatasources } from "apollo-server-core/dist/graphqlOptions";
import { DataSource as AuthorsDataSource } from "./app/authors";

export interface DataSources {
  Authors: typeof AuthorsDataSource;
}

export function dataSources() {
  return {
    Authors: AuthorsDataSource,
  } as GraphQLDatasources<DataSources>;
}
```

Primeiro nós criamos uma interface que passamos pro `GraphQLDatasources` e depois uma exportamos uma
função dataSources que nos retorna um objeto com os data sources que vamos utilizar.

*se você não estiver usando typescript você só precisa da função que retorna um objeto.*

O próximo passo é importar isso no nosso server e passar na instância do ApolloServer:

```ts
import { dataSources } from "./datasources";

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources, // importamos aqui nossos dataSources
});
```

A partir desso ponto nós já podemos usar nossos dataSources em qualquer resolver da aplicação...
mas como? Bem, vamos lá no resolver dos nossos autores, se você não está usando typescript você
pode pular direto pro [resolver](#refatorando-o-resolver-de-autores)

## Calma, vamos melhorar um pouco o suporte do typescript nos nossos resolvers
Antes de continuar vamos criar um arquivo pra lidar com alguns tipos, na raiz de src vamos criar o arquivo
`types.ts` e o conteúdo vai ser o seguinte:

```ts
import { IResolvers } from "apollo-server";
import { DataSources } from "./datasources";
export type ID = string | undefined;

export type Context = {
  dataSources: DataSources;
  [field: string]: any;
};

export interface Resolvers<Source> extends IResolvers<Source, Context> {}
```

Aqui nós basicamente criamos uma interface que extende a IResolvers do Apollo, mas deixamos o
Source como obrigatório e passamos o nosso tipo Context que tem as informações dos nossos data sources,
feito isso podemos ir pro nosso `app/authors/resolvers.ts`

## Refatorando o Resolver de autores
No resolver de autores vamos mudar poucas coisas, primeiro vamos remover o import do nosso datasource.ts
no fim nosso arquivo deve ficar da seguinte forma:

```ts
import { Resolvers } from "../../types";
import { Author } from "./model";

type Args = {
  id: string;
};

type AuthorInput = {
  input: Author;
};

type InputWithID = {
  input: { id: string } & Author;
};

export const resolvers: Resolvers<Author> = {
  Query: {
    authors: (_parent, args, { dataSources }) => {
      return dataSources.Authors.loader(args);
    },

    author: (_parent, { id }: Args, { dataSources }) => {
      return dataSources.Authors.load({ id });
    },
  },

  Mutation: {
    createAuthor: (_parent, args: AuthorInput, { dataSources }) => {
      return dataSources.Authors.create(args.input);
    },

    updateAuthor: (_parent, args: InputWithID, { dataSources }) => {
      return dataSources.Authors.update(args.input);
    },

    deleteAuthor: (_parent, args: Args, { dataSources }) => {
      return dataSources.Authors.destroy(args.id);
    },
  },
};
```

E é isso, a partir de agora podemos mudar avançar um pouco, porém faremos isso no próximo artigo.

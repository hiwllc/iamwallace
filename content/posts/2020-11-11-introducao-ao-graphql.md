---
title: Introdução ao GraphQL
date: 2020-11-11
description: Olá, você tem um minuto pra ler a palavra do GraphQL?
cover: images/apollo-server.png
---

## Introdução
Desde que eu comecei a ler sobre GraphQL (entre 2016 e 2017) eu entrei no hype da ferramenta
e desde então venho tentando fazer algumas coisas que não seja só estudo, já tentei algumas
vezes implementar algo nas empresas que trabalhei.

Há algumas semanas eu comecei [uma pequena aplicação](https://minhacompra.app) pra praticar um pouco de React Native pensei
em usar Firebase pra resolver parte do backend, porém... eu achei que isso seria uma oportunidade
pra praticar um pouco com GraphQL.

Depois de fazer uma implementação inicial do backend (não 100%) eu decidi escrever esse
artigo aqui pra falar sobre como está sendo e principalmente explicar um pouco sobre as decisões
que eu tomei.

## O que é GraphQL?

Vamos lá na especificação dar uma olhada

> GraphQL é uma linguagem de consulta *(query language)* e motor de execução *(engine)* criado pelo Facebook em 2012 - https://spec.graphql.org/June2018/#sec-Overview

[Ainda na especificação](https://spec.graphql.org/June2018/#sec-Overview) nós podemos ler que GraphQL foi construído para criação de aplicações que executem no cliente (quem consome os dados) fornecendo uma sintaxe intuitiva e flexível para descrever os dados necessários.

Outro detalhe importante é que a especificação descreve que GraphQL **não é uma linguagem de programação** mas sim uma linguagem para consultar servidores que possuem os recursos definidos na especificação do GraphQL *(GraphQL services)*.

GraphQL é agnóstico a linguagem de programação, protocolo e banco de dados.

*Eu recomendo bastante a leitura de especificação, tem bastante coisas interessante lá.*

Tentando deixar mais simples, podemos dizer que:

- GraphQL é uma linguagem de consulta para API's
- Um serviço implementado no servidor (backend) que executa consultas usando os tipos que você define para seus dados.

## Conclusão

Bem, o artigo acabou ficando um pouco grande, e como eu prefiro uma abordagem mais prática, nos próximos artigos
vamos nos aprofundar um pouco mais nos conceitos enquanto criamos nossa aplicação.

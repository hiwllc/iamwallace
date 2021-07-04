---
title: Unity 3D, Arch Linux e VSCode
date: 2020-10-03
description: Esse artigo é mais pra me lembrar como fazer essa configuração
cover: images/unity-vscode-arch.png
---

[Você pode pular minha introdução e ir direto pra onde eu faço a instalação das coisas.](#arrumando-a-casa)

Recentemente eu comecei a estudar desenvolvimento de jogos usando Unity3D, e como usuário do Linux a parte que mais tive problema era configurar um editor que me desse o mesmo poder que uma IDE como o [Visual Studio][4] me oferece no Windows.

Eu não queria ter que migrar pro windows.

## Porque o Unity3D?

Eu optei por usar Unity por ser bastante popular e *fácil* de achar ajuda e conteúdo na internet.

## VSCode

VSCode é um editor de texto que se tornou bem popular nos últimos anos, acredito que mais pelo seu intellisense e coisas integradas que o tornam mais parecido com uma IDE, então eu pensei que talvez ele pudesse me ajudar.

Então resolvi deixar registrado essas coisas aqui porque não foi tão simples quanto eu gostaria, vamos lá.

## <a name="arrumando-a-casa"></a> Arrumando a casa

> Observação: Eu vou assumir que você estja utilizando o Arch, você vai precisar ter instalado: [Unity3D][1] e [VSCode.][2] *(esse último eu sempre instalo usando o pacman)*

Você vai precisar instalar o Mono e a SDK do Dotnet, você pode instalar essas via pacman.

```bash
sudo pacman -S mono dotnet-sdk dotnet-runtime
```

Depois disso você vai precisar instalar a extensão do [C# pro VSCode][3]

Agora, no unity inicie seu projeto, crie um script e abra, **atenção aqui pra verificar se o seu editor padrão é o VSCode.**

Se tudo correr bem você vai conseguir ter o intellisense funcionando.

![vscode com autocomplete pro Unity3D](/upload/vscode-unity.png)

## Unity3d 2020...
Quando eu criei meu projeto no Unity eu optei por usar a versão 2019.x por ser LTS, porém eu tive um problema com a tecla de espaço, que aparentemente não funciona no linux apenas.

Então eu resolvi ir pra versão 2020.x que funcionou muito bem, mas ai o VSCode parou de funcionar o auto complete...

![why](https://media.giphy.com/media/kyrd72DC2Iwfu/giphy.gif)

Depois de algum tempo perdido na internet eu resolvi fuçar as configurações do projeto e achei a opção de gerar os arquivos *.csproj*

Pra resolver isso: *Preferences > External Tools* marque a opção: `Registry packages` e clique em *Regenerate project files* e pronto, tudo voltou ao normal.

É isso pessoal, pelo menos pra mim foi isso, minha experiência (1 mês) com Unity é que no Linux as coisas acontecem de formas esquisitas.

**obs:** eu não sei quase nada de C# então isso acaba influênciando bastante em como lido com as coisas no Unity3D

## Referências

- https://medium.com/@sami1592/set-up-visual-studio-code-for-unity-in-linux-69b7f4352e0b
- https://www.youtube.com/watch?v=btga03_gGfw

[1]: https://unity3d.com/pt/get-unity/download
[2]: https://code.visualstudio.com/download
[3]: https://code.visualstudio.com/docs/languages/csharp
[4]: https://visualstudio.microsoft.com/pt-br/

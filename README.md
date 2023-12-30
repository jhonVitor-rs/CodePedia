# Welcome to Remix App!

- [Remix Docs](https://remix.run/docs)

## Development

Para rodar o programa, voce tera de baixalo, e possivel fazer isto com o comando: 

```sh
  git clone https://github.com/jhonVitor-rs/CodePedia.git
```

Apos baixar e extrair os aquivos basta ir ate a sua pasta e rodar o comando
Lembre-se de configurar suaa variaveis de ambiente elas o exemplo delas esta presente no arquivo .env.example,

Você precisará de uma credencial de acesso ao mongodb da atlas e uma credencial de acesso ao cloudyflare para upload de imagens, as variaveis NODE_ENV e SESSION_SECRET são variaveis simples, esta primeira ja esta preenchida no arquivo de exemplo a segunda pode ser preenchida com uma cadeia de caracteres aleatorios criada por você.

```sh
npm run dev
```

Assim voce rodará o programa em modo desenvolvedor.

No programa e possivel voce criar sua conta com nome, sobrenome, email, username e password, apos fazer o login na primeira vez o remix usara os cookies do navegador para lembrar-se de você, isso ira durar 30 dias ate ser necessáro refazer o login. Você pode criar posts de codigos atraves do editor de texto, porem esta função so e disponivel se voce tiver conta e estiver logado, se esse for o caso basta passar o mouse por cima do icone com sua foto e username no canto supeior direito e aparecerá a opção 'New Post', voce tambem verá as opçoes de 'Access Porfile' e ' Logout', acredito que elas sejam auto explicativas.
Na pagina de login voce verá sedu perfil com seus posts e comentarios e na area superior vera as suas informações de perfil, no canto superior direito das informações de perfil terão tres botoes, o primeiro e para publicar um novo post, o segundo abrira o modal para editar suas informações e o terceiro sera de logout. Para carregar uma foto de perfil, basta clicar no circulo com o simbolo + ao lado das informações de perfil, se ja tiver alguma foto carregada e voce pretende torcala basta clicar no icone de lapis/caneta na foto de perfil.
Ao clicar em algum post ou comentario sera redirecionado para a pagina do post, la voce pode ver quem comentou seu post, e voce mesmo pode adicionar um comentário, função eu tambem so esta abilitada ao fazer o login.

## Desenvolvimento

A você desenvolvedor que esta olhando meu código, o projeto foi feito com remix.js e typescript, utilizei os cookies do remix para persistir o login do usuário, no editor de texto utilizei o slate.js, para criar um editor simples, utilizo o prisma orm para comunicação com o banco de dados, o qual optei pelo mongodb da atlas, inicialmente estava planejando em utilizar o postgres mas estava com dificuldades em conectalo a um banco de dados na nuvem, utilizei o shadcn e tailwind para fazer a estilização do projeto, e o zod para uma validação simples dos formularios, o upload de fotos de perfil e feito para o cloudyflare.

Voce vera um link na se redirecionando para o deploy na vercel, infelismente esta link não esta funcionando, tive problemas com as variaveis de ambiente, procurei respostas em foruns e nas IAs mas não encontrei nada que me auxiliace. Se estiver com tempo livre fique vontade para olhar o código e tentar corrigir o erro do deploy, ficaria feliz em saber que alguem se intereçou por um codigo meu,
Obrigado por sua atenção!!!

# Estrutura do projeto

`src/app/central/central.exposicao.ts` exporta as rotas e o menu da Central. `src/app/cooperativa/cooperativa.exposicao.ts` exporta os da Cooperativa. Cada produto ocupa `<participante>/<produto>/`; neste momento, `credito-rural/` contém somente a página de prova. `federation.config.js` publica as exposições e compartilha as dependências. `src/main.ts` inicializa a federação quando a aplicação é aberta diretamente. As cascas carregam as exposições sem executar esse bootstrap.

A aplicação não contém cópias de `core/` ou `shared/`. Serviços de sessão, guards, layout, componentes e clientes de segurança e cadastro vêm da API pública de `angular-wprocesso-coop-ui`. O cliente do back de Crédito e as telas do fluxo de negócio pertencem a uma entrega posterior.

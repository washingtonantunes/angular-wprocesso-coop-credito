# Estrutura do projeto

`src/app/central/central.exposicao.ts` exporta as rotas e o menu da Central. `src/app/cooperativa/cooperativa.exposicao.ts` exporta os da Cooperativa. Cada produto ocupa `<participante>/<produto>/`; `credito-rural/` tem `pages/` (as páginas carregadas pelas rotas) e `modais/` (os modais abertos por elas). `federation.config.js` publica as exposições e compartilha as dependências. `src/main.ts` inicializa a federação quando a aplicação é aberta diretamente. As cascas carregam as exposições sem executar esse bootstrap.

Em `src/app/shared/` ficam os recursos próprios da área: `services/credito/` e `services/cadastro/` com os clientes gerados por `ng-openapi-gen` a partir do descritor de cada back real (a pasta `api/` é gerada no build e não versionada), e `api/area-api.ts` com os endereços dos backs e a função que ajusta o `rootUrl` dos clientes (ver `PADROES.md`).

A aplicação não contém cópias de `core/` ou `shared/` da plataforma. Sessão, guards, layout, componentes, pipes e diretivas vêm da API pública de `angular-wprocesso-coop-ui`. Os clientes de API, porém, são gerados na própria área, não na UI.

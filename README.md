# angular-wprocesso-coop-credito

Aplicação remota da área de Crédito. Publica as exposições `./central` e `./cooperativa` para as duas cascas do wprocesso-coop. Cada exposição contém uma página da área de Crédito protegida pela sua funcionalidade de consulta.

## Execução

Compile primeiro `angular-wprocesso-coop-ui` com `npm install` e `npm run build`. Nesta pasta, execute `npm install` e `npm run start:dev`; o `remoteEntry.json` ficará em `http://localhost:4202/remoteEntry.json`. Para compilar, use `npm run build`. A casca Central usa a exposição `./central`, e a Cooperativa usa `./cooperativa`.

O contrato, o compartilhamento da sessão e a publicação independente estão em [MICROFRONT.md da UI](../angular-wprocesso-coop-ui/docs/MICROFRONT.md). Para Docker, a partir de `wprocesso-coop/docker-wprocesso-coop/`, use `docker compose up --build -d` (ver o `README.md` de lá).

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [docs/AMBIENTE.md](docs/AMBIENTE.md) | Comandos locais e Docker |
| [docs/ESTRUTURA.md](docs/ESTRUTURA.md) | Pastas, exposições e responsabilidades |
| [docs/PADROES.md](docs/PADROES.md) | Rotas, menu e autorização |
| [docs/LAYOUT.md](docs/LAYOUT.md) | Apresentação das telas |
| [docs/PRIMENG.md](docs/PRIMENG.md) | Componentes visuais |
| [docs/REGRAS.md](docs/REGRAS.md) | Regras desta aplicação remota |

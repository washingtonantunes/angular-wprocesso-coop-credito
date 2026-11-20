# Padrões de implementação

Componentes são standalone, usam `inject()` para DI e seguem os padrões das cascas. Cada exposição exporta `ROTAS_PRODUTOS` e `MENU_PRODUTOS` com os tipos públicos da UI. Toda rota informa a funcionalidade e o código do produto. A casca aplica `authGuard` e `funcionalidadeGuard` em `canMatch`; o componente é carregado por `loadComponent` depois deles. O menu também é filtrado pelas funcionalidades efetivas do login.

A aplicação importa da API pública da UI e de seus próprios arquivos. Não importa de uma casca ou de outra área. Futuras chamadas de API do Crédito usarão cliente gerado a partir do back real; as de cadastro usarão o cliente já exposto pela UI.

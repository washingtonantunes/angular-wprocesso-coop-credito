# Padrões de implementação

Componentes são standalone, usam `inject()` para DI e seguem os padrões das cascas. Cada exposição exporta `ROTAS_PRODUTOS` e `MENU_PRODUTOS` com os tipos públicos da UI. Toda rota informa a funcionalidade e o código do produto. A casca aplica `authGuard` e `funcionalidadeGuard` em `canMatch`; o componente é carregado por `loadComponent` depois deles. O menu também é filtrado pelas funcionalidades efetivas do login.

A aplicação importa da API pública da UI e de seus próprios arquivos. Não importa de uma casca ou de outra área. A área gera os próprios clientes dos backs que chama, o de crédito (back da área) e o de cadastro (plataforma, só a busca de cooperado por documento), a partir do descritor do back real, com `ng-openapi-gen`, em `shared/services/<back>/`. A UI não expõe clientes de crédito nem de cadastro.

## Endereço dos backs (rootUrl)

As telas rodam na página da casca e chamam os backs por caminhos relativos `/api/coop-<back>`, encaminhados pela casca (proxy no desenvolvimento local, nginx no Docker). O caminho é o mesmo em todos os ambientes, então os dois endereços ficam numa constante da área, em `shared/api/area-api.ts`.

Esse endereço não pode ser fornecido por provider de rota. Os serviços gerados são `@Injectable({ providedIn: 'root' })`, instância única da raiz, e resolvem o `ApiConfiguration` na raiz; um provider em injetor de rota ou de componente não alcança essa instância. O `DialogService` do PrimeNG ainda cria os modais com o `environmentInjector` da raiz da aplicação, então o modal também resolve o serviço na raiz, qualquer que seja o injetor de quem o abriu.

Por isso a área ajusta o `rootUrl` da própria instância, pela API pública do cliente gerado, em `configurarEnderecosApi()`. A função é idempotente e é chamada no construtor de cada página de entrada das exposições (as que as rotas carregam), antes de qualquer chamada; os modais abertos a partir delas já encontram os serviços ajustados. Não se chama no nível de módulo do arquivo da exposição. Essa forma vale para toda área nova.

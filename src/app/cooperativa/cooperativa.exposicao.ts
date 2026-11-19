import type { ItemMenuProduto, RotaProduto } from 'angular-wprocesso-coop-ui';

export const ROTAS_PRODUTOS: RotaProduto[] = [
  {
    path: 'credito/credito-rural',
    funcionalidade: 'CREDITO_RURAL_PAGINADO_COOPERATIVA',
    produtoCodigo: 'CREDITO_RURAL',
    loadComponent: () => import('./credito-rural/prova-cooperativa.component').then((modulo) => modulo.ProvaCooperativaComponent),
  },
];

export const MENU_PRODUTOS: ItemMenuProduto[] = [
  {
    area: 'Crédito',
    label: 'Crédito Rural',
    icon: 'pi pi-wallet',
    routerLink: '/credito/credito-rural',
    funcionalidade: 'CREDITO_RURAL_PAGINADO_COOPERATIVA',
    produtoCodigo: 'CREDITO_RURAL',
  },
];

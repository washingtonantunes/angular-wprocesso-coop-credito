import { inject } from '@angular/core';

import { CadastroServices } from '../services/cadastro';
import { CreditoServices } from '../services/credito';

// Endereços relativos dos backs que a área consome. O encaminhamento de cada um
// é configuração de ambiente da casca (proxy no desenvolvimento, servidor web
// montado no Docker), então o caminho é o mesmo em todos os ambientes.
export const ENDERECOS_API = {
  credito: '/api/coop-credito',
  cadastro: '/api/coop-cadastro',
} as const;

// Os serviços gerados são instância única da raiz e o DialogService do PrimeNG
// abre os modais na raiz, então configurar o endereço por provider de rota não
// alcança nem a página nem o modal. Esta função ajusta o rootUrl da própria
// instância compartilhada; é idempotente e deve ser chamada no construtor de
// cada página de entrada das exposições, antes de qualquer chamada.
export function configurarEnderecosApi(): void {
  inject(CreditoServices.OperacaoDeCreditoRuralService).rootUrl = ENDERECOS_API.credito;
  inject(CadastroServices.CooperadoService).rootUrl = ENDERECOS_API.cadastro;
}

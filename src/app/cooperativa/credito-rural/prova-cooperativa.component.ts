import { Component, inject } from '@angular/core';
import { AuthService } from 'angular-wprocesso-coop-ui';

@Component({
  selector: 'app-prova-cooperativa-credito-rural',
  template: '<div class="p-fluid grid"><div class="col-12 px-6 py-6"><h2>Crédito Rural · Cooperativa</h2><p>Página de prova do front de Crédito.</p><p>Sessão: {{ auth.currentUser()?.nome }}</p></div></div>',
})
export class ProvaCooperativaComponent {
  protected readonly auth = inject(AuthService);
}

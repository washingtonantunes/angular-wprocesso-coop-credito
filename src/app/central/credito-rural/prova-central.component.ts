import { Component, inject } from '@angular/core';
import { AuthService } from 'angular-wprocesso-coop-ui';

@Component({
  selector: 'app-prova-central-credito-rural',
  template: '<div class="p-fluid grid"><div class="col-12 px-6 py-6"><h2>Crédito Rural · Central</h2><p>Página de prova do front de Crédito.</p><p>Sessão: {{ auth.currentUser()?.nome }}</p></div></div>',
})
export class ProvaCentralComponent {
  protected readonly auth = inject(AuthService);
}

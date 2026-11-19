import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: '<main><h1>Crédito</h1><p>As páginas da área são abertas pelas cascas Central e Cooperativa.</p></main>',
  styles: ['main { font-family: sans-serif; padding: 2rem; }'],
})
class AppComponent {}

bootstrapApplication(AppComponent).catch((erro) => console.error('Não foi possível iniciar o Crédito', erro));

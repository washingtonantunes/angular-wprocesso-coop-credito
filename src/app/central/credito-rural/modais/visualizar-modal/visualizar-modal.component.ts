import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

import { EnumFormatPipe, ModalLayoutComponent, ToastService } from 'angular-wprocesso-coop-ui';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CreditoModels, CreditoServices } from '../../../../shared/services/credito';

@Component({
  selector: 'app-visualizar-operacao-central',
  templateUrl: './visualizar-modal.component.html',
  imports: [CurrencyPipe, EnumFormatPipe, ButtonModule, ModalLayoutComponent],
})
export class VisualizarOperacaoCentralComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly operacaoService = inject(CreditoServices.OperacaoDeCreditoRuralService);
  private readonly toastService = inject(ToastService);

  operacao = signal<CreditoModels.OperacaoCreditoRuralResponseDto | null>(null);
  carregando = signal(true);

  constructor() {
    const operacaoId = this.config.data?.operacaoId as number;
    this.operacaoService.buscar({ id: operacaoId }).subscribe({
      next: (operacao) => {
        this.operacao.set(operacao);
        this.carregando.set(false);
      },
      error: (erro: HttpErrorResponse) => {
        this.carregando.set(false);
        this.toastService.mostrarMsgErro(erro);
        this.ref.close();
      },
    });
  }

  onFechar(): void {
    this.ref.close();
  }
}

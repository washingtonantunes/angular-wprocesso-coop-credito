import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MensagemComponent, ModalLayoutComponent, ToastService } from 'angular-wprocesso-coop-ui';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextareaModule } from 'primeng/textarea';

import { CreditoModels, CreditoServices } from '../../../../shared/services/credito';

@Component({
  selector: 'app-negar-modal',
  templateUrl: './negar-modal.component.html',
  imports: [ReactiveFormsModule, ButtonModule, TextareaModule, ModalLayoutComponent, MensagemComponent],
})
export class NegarModalComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly fb = inject(FormBuilder);
  private readonly operacaoService = inject(CreditoServices.OperacaoDeCreditoRuralService);
  private readonly toastService = inject(ToastService);

  salvando = signal(false);
  private readonly operacaoId = this.config.data?.operacaoId as number;

  formulario: FormGroup = this.fb.group({
    motivo: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  onNegar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const body: CreditoModels.NegarCreditoRuralRequestDto = {
      motivo: this.formulario.getRawValue().motivo.trim(),
    };

    this.salvando.set(true);
    this.operacaoService.negar({ id: this.operacaoId, body }).subscribe({
      next: () => this.ref.close(true),
      error: (erro: HttpErrorResponse) => {
        this.salvando.set(false);
        this.toastService.mostrarMsgErro(erro);
      },
    });
  }

  onCancelar(): void {
    this.ref.close();
  }
}

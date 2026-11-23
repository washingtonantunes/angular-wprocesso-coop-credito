import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DocumentoMaskDirective, MensagemComponent, ModalLayoutComponent, ToastService } from 'angular-wprocesso-coop-ui';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { CadastroModels, CadastroServices } from '../../../../shared/services/cadastro';
import { CreditoModels, CreditoServices } from '../../../../shared/services/credito';

@Component({
  selector: 'app-contratar-modal',
  templateUrl: './contratar-modal.component.html',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
    ModalLayoutComponent,
    MensagemComponent,
    DocumentoMaskDirective,
  ],
})
export class ContratarModalComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly fb = inject(FormBuilder);
  private readonly cooperadoService = inject(CadastroServices.CooperadoService);
  private readonly operacaoService = inject(CreditoServices.OperacaoDeCreditoRuralService);
  private readonly toastService = inject(ToastService);

  cooperado = signal<CadastroModels.CooperadoDocumentoResponseDto | null>(null);
  buscando = signal(false);
  salvando = signal(false);

  formulario: FormGroup = this.fb.group({
    documento: ['', Validators.required],
    valor: [null as number | null, [Validators.required, Validators.min(0.01)]],
    finalidade: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  constructor() {
    this.travarValorEFinalidade();
    // Alterar o documento invalida o cooperado já encontrado: trava valor e
    // finalidade até uma nova busca.
    this.formulario.get('documento')?.valueChanges.subscribe(() => {
      if (this.cooperado()) {
        this.cooperado.set(null);
        this.travarValorEFinalidade();
      }
    });
  }

  onBuscarCooperado(): void {
    const documento = this.formulario.get('documento');
    if (documento?.invalid) {
      documento.markAsTouched();
      return;
    }

    this.buscando.set(true);
    this.cooperadoService.buscarCooperadoPorDocumento({ documento: documento?.value }).subscribe({
      next: (cooperado) => {
        this.buscando.set(false);
        this.cooperado.set(cooperado);
        this.formulario.get('valor')?.enable();
        this.formulario.get('finalidade')?.enable();
      },
      error: (erro: HttpErrorResponse) => {
        this.buscando.set(false);
        this.cooperado.set(null);
        this.travarValorEFinalidade();
        this.toastService.mostrarMsgErro(erro);
      },
    });
  }

  onSalvar(): void {
    const cooperado = this.cooperado();
    if (!cooperado || this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    const body: CreditoModels.ContratarCreditoRuralRequestDto = {
      cooperadoId: cooperado.id,
      valor: valores.valor,
      finalidade: valores.finalidade.trim(),
    };

    this.salvando.set(true);
    this.operacaoService.contratar({ body }).subscribe({
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

  private travarValorEFinalidade(): void {
    this.formulario.get('valor')?.disable();
    this.formulario.get('finalidade')?.disable();
  }
}

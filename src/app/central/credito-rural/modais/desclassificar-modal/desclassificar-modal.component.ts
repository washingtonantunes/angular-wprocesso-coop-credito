import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { MensagemComponent, ModalLayoutComponent, ToastService } from 'angular-wprocesso-coop-ui';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { CreditoModels, CreditoServices } from '../../../../shared/services/credito';

type TipoDesclassificacao = CreditoModels.DesclassificarCreditoRuralRequestDto['tipoDesclassificacao'];

const TIPO_OPTIONS: { label: string; value: TipoDesclassificacao }[] = [
  { label: 'Total', value: 'TOTAL' },
  { label: 'Parcial', value: 'PARCIAL' },
];

@Component({
  selector: 'app-desclassificar-modal',
  templateUrl: './desclassificar-modal.component.html',
  imports: [ReactiveFormsModule, ButtonModule, InputNumberModule, SelectModule, TextareaModule, ModalLayoutComponent, MensagemComponent],
})
export class DesclassificarModalComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly fb = inject(FormBuilder);
  private readonly operacaoService = inject(CreditoServices.OperacaoDeCreditoRuralService);
  private readonly toastService = inject(ToastService);

  tipoOptions = TIPO_OPTIONS;
  salvando = signal(false);

  private readonly operacaoId = this.config.data?.operacaoId as number;
  readonly valorOperacao = this.config.data?.valor as number;

  readonly mensagensValor = { valorMaiorOuIgual: 'Deve ser menor que o valor da operação' };

  formulario: FormGroup = this.fb.group({
    tipoDesclassificacao: [null as TipoDesclassificacao | null, Validators.required],
    valorDesclassificado: [{ value: null as number | null, disabled: true }, [Validators.required, Validators.min(0.01)]],
    motivo: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  constructor() {
    this.formulario.get('tipoDesclassificacao')?.valueChanges.subscribe((tipo: TipoDesclassificacao) => this.ajustarValor(tipo));
  }

  onDesclassificar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    const body: CreditoModels.DesclassificarCreditoRuralRequestDto = {
      tipoDesclassificacao: valores.tipoDesclassificacao,
      valorDesclassificado: valores.valorDesclassificado,
      motivo: valores.motivo.trim(),
    };

    this.salvando.set(true);
    this.operacaoService.desclassificar({ id: this.operacaoId, body }).subscribe({
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

  // Total desclassifica o valor cheio da operação; parcial exige valor menor.
  private ajustarValor(tipo: TipoDesclassificacao): void {
    const controle = this.formulario.get('valorDesclassificado');
    if (!controle) return;

    if (tipo === 'TOTAL') {
      controle.setValue(this.valorOperacao);
      controle.setValidators([Validators.required]);
      controle.disable();
    } else {
      controle.setValue(null);
      controle.setValidators([Validators.required, Validators.min(0.01), this.menorQueValor]);
      controle.enable();
    }
    controle.updateValueAndValidity();
  }

  private readonly menorQueValor = (controle: AbstractControl): ValidationErrors | null => {
    const valor = controle.value;
    return valor !== null && valor >= this.valorOperacao ? { valorMaiorOuIgual: true } : null;
  };
}

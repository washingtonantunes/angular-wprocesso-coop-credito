import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService, DIALOG_CONFIG, EnumFormatPipe, ToastService } from 'angular-wprocesso-coop-ui';

import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Menu } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { TableModule, TablePageEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { configurarEnderecosApi } from '../../../../shared/api/area-api';
import { CreditoModels, CreditoServices } from '../../../../shared/services/credito';
import { DesclassificarModalComponent } from '../../modais/desclassificar-modal/desclassificar-modal.component';
import { NegarModalComponent } from '../../modais/negar-modal/negar-modal.component';
import { VisualizarOperacaoCentralComponent } from '../../modais/visualizar-modal/visualizar-modal.component';

type StatusOperacao = CreditoModels.OperacaoCreditoRuralResponseDto['status'];

const STATUS_OPTIONS: { label: string; value: StatusOperacao }[] = [
  { label: 'Solicitada', value: 'SOLICITADA' },
  { label: 'Aprovada', value: 'APROVADA' },
  { label: 'Negada', value: 'NEGADA' },
  { label: 'Desclassificada', value: 'DESCLASSIFICADA' },
];

const SEVERIDADE_STATUS: Record<StatusOperacao, 'info' | 'success' | 'danger' | 'warn'> = {
  SOLICITADA: 'info',
  APROVADA: 'success',
  NEGADA: 'danger',
  DESCLASSIFICADA: 'warn',
};

@Component({
  selector: 'app-operacao-lista-central',
  templateUrl: './operacao-lista-central.component.html',
  imports: [
    CurrencyPipe,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule,
    ToolbarModule,
    Menu,
    TooltipModule,
    EnumFormatPipe,
  ],
})
export class OperacaoListaCentralComponent {
  private readonly authService = inject(AuthService);
  private readonly operacaoService = inject(CreditoServices.OperacaoDeCreditoRuralService);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly toastService = inject(ToastService);

  statusOptions = STATUS_OPTIONS;

  operacoes = signal<CreditoModels.OperacaoCreditoRuralResponseDto[]>([]);
  operacaoSelecionada = signal<CreditoModels.OperacaoCreditoRuralResponseDto | null>(null);

  filtroStatus = signal<StatusOperacao | null>(null);
  filtroCooperado = signal('');
  filtroCooperativa = signal('');

  pagina = signal(0);
  porPagina = signal(5);
  totalRegistros = signal(0);

  menuAcoes = signal<MenuItem[]>([]);

  constructor() {
    configurarEnderecosApi();
  }

  severidade(status: StatusOperacao): 'info' | 'success' | 'danger' | 'warn' {
    return SEVERIDADE_STATUS[status];
  }

  onBuscar(): void {
    this.pagina.set(0);
    this.carregar();
  }

  onLimparFiltros(): void {
    this.filtroStatus.set(null);
    this.filtroCooperado.set('');
    this.filtroCooperativa.set('');
  }

  onPageChange(event: TablePageEvent): void {
    this.pagina.set(event.first / event.rows);
    this.porPagina.set(event.rows);
    this.carregar();
  }

  abrirMenu(event: Event, operacao: CreditoModels.OperacaoCreditoRuralResponseDto, menu: Menu): void {
    this.operacaoSelecionada.set(operacao);
    this.inicializarMenus();
    menu.toggle(event);
  }

  private inicializarMenus(): void {
    const operacao = this.operacaoSelecionada();
    if (!operacao) return;

    const solicitada = operacao.status === 'SOLICITADA';
    const aprovada = operacao.status === 'APROVADA';

    this.menuAcoes.set([
      {
        visible: this.authService.temFuncionalidade('CREDITO_RURAL_BUSCAR_CENTRAL'),
        label: 'Visualizar',
        icon: 'pi pi-eye',
        command: () => this.abrirVisualizar(operacao.id),
      },
      {
        visible: solicitada && this.authService.temFuncionalidade('CREDITO_RURAL_APROVAR'),
        label: 'Aprovar',
        icon: 'pi pi-check',
        command: () => this.confirmarAprovar(operacao),
      },
      {
        visible: solicitada && this.authService.temFuncionalidade('CREDITO_RURAL_NEGAR'),
        label: 'Negar',
        icon: 'pi pi-times',
        command: () => this.abrirNegar(operacao.id),
      },
      {
        visible: aprovada && this.authService.temFuncionalidade('CREDITO_RURAL_DESCLASSIFICAR'),
        label: 'Desclassificar',
        icon: 'pi pi-exclamation-triangle',
        command: () => this.abrirDesclassificar(operacao),
      },
    ]);
  }

  private carregar(): void {
    this.operacaoService
      .pesquisarPaginado({
        filtro: {
          status: this.filtroStatus() ?? undefined,
          cooperadoNome: this.filtroCooperado().trim() || undefined,
          cooperativaNome: this.filtroCooperativa().trim() || undefined,
        },
        pageable: { page: this.pagina(), size: this.porPagina() },
      })
      .subscribe({
        next: (response) => {
          this.operacoes.set(response.content ?? []);
          this.totalRegistros.set(response.totalElements ?? 0);
        },
        error: (erro: HttpErrorResponse) => this.toastService.mostrarMsgErro(erro),
      });
  }

  private abrirVisualizar(operacaoId: number): void {
    this.dialogService.open(VisualizarOperacaoCentralComponent, {
      ...DIALOG_CONFIG.md,
      header: 'Operação de Crédito Rural',
      data: { operacaoId },
    });
  }

  private confirmarAprovar(operacao: CreditoModels.OperacaoCreditoRuralResponseDto): void {
    this.confirmationService.confirm({
      message: `Deseja aprovar a operação do cooperado "${operacao.cooperadoNome}"?`,
      header: 'Confirmar Ação',
      icon: 'pi pi-question-circle',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Sim, aprovar', severity: 'success' },
      accept: () => this.aprovar(operacao.id),
    });
  }

  private aprovar(operacaoId: number): void {
    this.operacaoService.aprovar({ id: operacaoId }).subscribe({
      next: () => {
        this.toastService.mostrarMsgSucesso('Operação aprovada com sucesso.');
        this.carregar();
      },
      error: (erro: HttpErrorResponse) => this.toastService.mostrarMsgErro(erro),
    });
  }

  private abrirNegar(operacaoId: number): void {
    const ref = this.dialogService.open(NegarModalComponent, {
      ...DIALOG_CONFIG.md,
      header: 'Negar Operação',
      data: { operacaoId },
    });

    ref?.onClose.subscribe((negado) => {
      if (negado) {
        this.toastService.mostrarMsgSucesso('Operação negada com sucesso.');
        this.carregar();
      }
    });
  }

  private abrirDesclassificar(operacao: CreditoModels.OperacaoCreditoRuralResponseDto): void {
    const ref = this.dialogService.open(DesclassificarModalComponent, {
      ...DIALOG_CONFIG.md,
      header: 'Desclassificar Operação',
      data: { operacaoId: operacao.id, valor: operacao.valor },
    });

    ref?.onClose.subscribe((desclassificado) => {
      if (desclassificado) {
        this.toastService.mostrarMsgSucesso('Operação desclassificada com sucesso.');
        this.carregar();
      }
    });
  }
}

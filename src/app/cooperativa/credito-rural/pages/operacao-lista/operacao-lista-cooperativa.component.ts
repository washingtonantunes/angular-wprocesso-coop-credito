import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService, DIALOG_CONFIG, EnumFormatPipe, ToastService } from 'angular-wprocesso-coop-ui';

import { MenuItem } from 'primeng/api';
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
import { ContratarModalComponent } from '../../modais/contratar-modal/contratar-modal.component';
import { VisualizarOperacaoCooperativaComponent } from '../../modais/visualizar-modal/visualizar-modal.component';

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
  selector: 'app-operacao-lista-cooperativa',
  templateUrl: './operacao-lista-cooperativa.component.html',
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
export class OperacaoListaCooperativaComponent {
  private readonly authService = inject(AuthService);
  private readonly operacaoService = inject(CreditoServices.OperacaoDeCreditoRuralService);
  private readonly dialogService = inject(DialogService);
  private readonly toastService = inject(ToastService);

  statusOptions = STATUS_OPTIONS;

  operacoes = signal<CreditoModels.OperacaoCreditoRuralResponseDto[]>([]);
  operacaoSelecionada = signal<CreditoModels.OperacaoCreditoRuralResponseDto | null>(null);

  filtroStatus = signal<StatusOperacao | null>(null);
  filtroCooperado = signal('');

  pagina = signal(0);
  porPagina = signal(5);
  totalRegistros = signal(0);

  menuAcoes = signal<MenuItem[]>([]);

  podeContratar = computed(() => this.authService.temFuncionalidade('CREDITO_RURAL_CONTRATAR'));

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
  }

  onPageChange(event: TablePageEvent): void {
    this.pagina.set(event.first / event.rows);
    this.porPagina.set(event.rows);
    this.carregar();
  }

  onAbrirContratar(): void {
    const ref = this.dialogService.open(ContratarModalComponent, {
      ...DIALOG_CONFIG.md,
      header: 'Contratar Crédito Rural',
    });

    ref?.onClose.subscribe((contratado) => {
      if (contratado) {
        this.toastService.mostrarMsgSucesso('Operação contratada com sucesso.');
        this.carregar();
      }
    });
  }

  abrirMenu(event: Event, operacao: CreditoModels.OperacaoCreditoRuralResponseDto, menu: Menu): void {
    this.operacaoSelecionada.set(operacao);
    this.inicializarMenus();
    menu.toggle(event);
  }

  private inicializarMenus(): void {
    const operacao = this.operacaoSelecionada();
    if (!operacao) return;

    this.menuAcoes.set([
      {
        visible: this.authService.temFuncionalidade('CREDITO_RURAL_BUSCAR_COOPERATIVA'),
        label: 'Visualizar',
        icon: 'pi pi-eye',
        command: () => this.abrirVisualizar(operacao.id),
      },
    ]);
  }

  private carregar(): void {
    // A cooperativa vem do token; esta tela não envia cooperativaId.
    this.operacaoService
      .pesquisarPaginado({
        filtro: {
          status: this.filtroStatus() ?? undefined,
          cooperadoNome: this.filtroCooperado().trim() || undefined,
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
    this.dialogService.open(VisualizarOperacaoCooperativaComponent, {
      ...DIALOG_CONFIG.md,
      header: 'Operação de Crédito Rural',
      data: { operacaoId },
    });
  }
}

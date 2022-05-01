import { Component, OnInit } from '@angular/core';
import {
  PoListViewAction,
  PoListViewLiterals,
  PoNotificationService,
  PoPageFilter,
} from '@po-ui/ng-components';
import { AgendamentosService } from './agendamentos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agendamentos',
  templateUrl: './agendamentos.component.html',
  styleUrls: ['./agendamentos.component.scss'],
})
export class AgendamentosComponent implements OnInit {
  myItems = [];
  myItemsHoje = [];
  myItemsSemana = [];
  myItemsFiltered = [];
  isHideLoading = false;
  labelFilter;
  verSemana = false;
  verTodas = false;

  readonly filterSettings: PoPageFilter = {
    action: this.processesFilter.bind(this),
    ngModel: 'labelFilter',
    placeholder: 'Pesquisar',
  };

  private myListActions: Array<PoListViewAction> = [
    {
      label: 'Confirmar',
      action: this.updateStatusConfirmar.bind(this),
      icon: 'po-icon-clock',
    },
    {
      label: 'Cancelar',
      action: this.updateStatusCancelar.bind(this),
      icon: 'po-icon-delete',
      type: 'danger',
    },
    {
      label: 'Concluir',
      action: this.updateStatusConcluir.bind(this),
      icon: 'po-icon-ok',
      type: 'danger',
    },
    {
      label: 'Pendente',
      action: this.updateStatusPendente.bind(this),
      icon: 'po-icon-help',
    },
    {
      label: 'Alterar',
      action: this.updateItem.bind(this),
      icon: 'po-icon-edit',
    },
  ];

  customLiterals: PoListViewLiterals = {
    noData: 'Não tem nenhum agendamento',
  };

  constructor(
    private service: AgendamentosService,
    private router: Router,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.onRefreshAgendas();
  }

  get items(): Array<any> {
    return this.myItemsFiltered;
  }
  get itemsHoje(): Array<any> {
    const hoje = this.service.getDateHoje();
    return this.myItemsFiltered.filter((x) => x.data === hoje);
  }
  get itemsSemana(): Array<any> {
    const hoje = this.service.getDateHoje();
    const last = this.service.getDateSemana();
    return this.myItemsFiltered.filter((x) => x.data > hoje && x.data <= last);
  }

  get listActions(): Array<PoListViewAction> {
    return this.myListActions;
  }

  onRefreshAgendas(): void {
    this.service
      .getAgendas()
      .then((res) => {
        this.myItems = res;
        this.myItemsFiltered = this.myItems;
        this.isHideLoading = true;
      })
      .catch((error) => {
        this.isHideLoading = true;
        this.poNotification.error(
          'Desculpa, tivemos um erro ao buscar os agendamentos!'
        );
      });
  }

  onAgendar(): void {
    this.router.navigateByUrl('schedule');
  }

  updateStatus(item, status): void {
    this.isHideLoading = false;
    this.service
      .updateStatusAgenda(item, status)
      .then(() => {
        this.onRefreshAgendas();
        this.poNotification.success(`Agenda alterada para o status ${status}!`);
      })
      .catch(() => {
        this.onRefreshAgendas();
        this.poNotification.error(
          'Desculpa, tivemos um erro ao alterar o status da agenda!'
        );
      });
  }

  updateStatusConfirmar(item): void {
    this.updateStatus(item, 'confirmado');
  }
  updateStatusCancelar(item): void {
    this.updateStatus(item, 'cancelado');
  }
  updateStatusConcluir(item): void {
    this.updateStatus(item, 'concluido');
    const email = encodeURIComponent(btoa(item.email));
    const key = encodeURIComponent(item.key);
    this.router.navigateByUrl(`schedule/${email}/${key}`);
  }
  updateStatusPendente(item): void {
    this.updateStatus(item, 'pendente');
  }
  updateItem(item): void {
    const email = encodeURIComponent(btoa(item.email));
    const key = encodeURIComponent(item.key);
    this.router.navigateByUrl(`schedule/${email}/${key}`);
  }

  // Filtro
  processesFilter(labelFilter = this.labelFilter): any {
    const filters =
      typeof labelFilter === 'string' ? [labelFilter] : [...labelFilter];
    this.myItemsFiltered = this.myItems.filter((item) => {
      return Object.keys(item).some(
        (key) =>
          !(item[key] instanceof Object) &&
          this.includeFilter(item[key], filters)
      );
    });
  }
  includeFilter(item, filters): any {
    return filters.some((filter) =>
      String(item).toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    );
  }
}

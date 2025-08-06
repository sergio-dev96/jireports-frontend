import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReportsService } from '../../service/reports.service';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-retrasados',
  imports: [TableModule, ButtonModule],
  templateUrl: './retrasados.component.html',
  styleUrl: './retrasados.component.scss'
})
export class RetrasadosComponent implements OnInit {
  reportsService = inject(ReportsService);
  retrasados: any = [];

  expandedRows = {}; // Para manejar el estado de expansión de las filas

  constructor() { }

  ngOnInit(): void {
    this.reportsService.getRetrasados().subscribe({
      next: (data: any[]) => {
        this.retrasados = data;
      },
      error: (error) => {
        console.error('Error fetching retrasados:', error);
      }
    });

  }

  rowStyle(issue: any) {
    if (issue.overdue_days > 0) {
      return { 'background-color': '#ff00156b' }; // Rojo claro
    }
    else {
      return {};
    }
  }

  onRowExpand(event: TableRowExpandEvent) {
    //this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    //this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
  }
}

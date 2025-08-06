import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { ReportsService } from '../../service/reports.service';
import { gantt } from 'dhtmlx-gantt';


@Component({
  selector: 'app-gantt-progress',
  imports: [],
  templateUrl: './gantt-progress.component.html',
  styleUrl: './gantt-progress.component.scss'
})
export class GanttProgressComponent implements OnInit {
  reportsService = inject(ReportsService);
  @ViewChild('ganttDiagram', { static: true }) ganttContainer!: ElementRef;

  ngOnInit(): void {
    gantt.config.date_format = '%d/%m/%Y';
    let columns = [
      { name: 'text', tree: true, width: "*", resize: true },
      { name: 'start_date', label: 'Inicio', align: 'center', resize: true, width: 100 },
      { name: 'duration', label: 'SP', align: 'center', width: 50, resize: true }
    ]
    gantt.config.columns = columns;
    //gantt.config.grid_elastic_columns = false;

    gantt.init(this.ganttContainer.nativeElement);



    gantt.config.readonly = true;

    console.log()




    this.reportsService.getGanttProgress().subscribe({
      next: (data) => {
        console.log(data);
        gantt.parse({ data });
      }
    })
  }
}

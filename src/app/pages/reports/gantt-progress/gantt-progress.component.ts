import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { ReportsService } from '../../service/reports.service';
import { gantt, GanttEnterprise, GanttInitializationConfig, GanttPlugins, NewTask, Task } from 'dhtmlx-gantt';
import { MultiSelectModule } from 'primeng/multiselect';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Project, Sprint } from '../../../core/interfaces/gantt-interfaces';

@Component({
  selector: 'app-gantt-progress',
  imports: [MultiSelectModule, IftaLabelModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './gantt-progress.component.html',
  styleUrl: './gantt-progress.component.scss'
})
export class GanttProgressComponent implements OnInit {
  reportsService = inject(ReportsService);
  ganttForm: FormGroup = new FormGroup({
    selectedProjects: new FormControl<Project[] | null>([]),
    selectedSprints: new FormControl<Sprint[] | null>([])
  });
  isLoading: boolean = false;
  isLoaded: boolean = false;

  projects: Project[] = [];
  sprints: Sprint[] = [];
  ganttDiagram: GanttEnterprise | undefined;

  @ViewChild('ganttDiagram', { static: true }) ganttContainer!: ElementRef;


  constructor() {

  }

  initGantt(data: NewTask[]) {
    gantt.config.date_format = '%d/%m/%Y';
    let columns = [
      {
        name: 'text', tree: true, width: "*", resize: true,
        template: (task: Task) => {
          if (task.parent)
            return `<img style="display:inline !important;" src="${task["issue_icon"]}" />${task.text}`;
          else
            return `${task.text}`;
        }
      },
      // { name: 'start_date', label: 'Inicio', align: 'center', resize: true, width: 100 },
      // { name: 'duration', label: 'SP', align: 'center', width: 50, resize: true }
    ]
    gantt.config.columns = columns;
    gantt.plugins({
      tooltip: true,

    });
    let dateToString = gantt.date.date_to_str('%d/%m/%Y');

    gantt.templates.format_date = (date: Date) => {
      return dateToString(date);
    };
    gantt.templates.tooltip_date_format = (date: Date) => {
      return dateToString(date);
    };

    gantt.templates.task_class = (start: Date, end: Date, task: Task) => {

      let estado = task["with_impediment"] ? "Impedimento" : task["issue_status"];
      switch (estado) {
        case "Finalizado":
        case "Desestimado":
          return "done";
        case "En Desarrollo":
        case "Pruebas en campo":
        case "Pruebas en escritorio":
          return "ready";
        case "Impedimento":
          return "blocked";
        default:
          return "";
      }
    };

    gantt.templates.tooltip_text = (start: Date, end: Date, task: Task) => {
      if (task.type === "project") {
        return `<div>Actividad: ${task.text}</div>
        `;
      }
      else if (task["issue_parent_key"]) {
        return `<div>Actividad: ${task.text}</div>
        <div>Inicio: ${gantt.templates.tooltip_date_format(start)}</div>
        <div>Fin: ${gantt.templates.tooltip_date_format(end)}</div>
        <div>Progreso: ${(task.progress! * 100).toFixed(2)} % </div>
        <div>Estado: ${task["issue_status"]}</div>
        <div>Funcionalidad: ${task["issue_parent_key"]} | ${task["issue_parent_name"]}</div>
        <div>Tiene impedimento: ${task["with_impediment"] ? "Si" : "No"}</div>
        `;
      }
      else {
        return `<div>Actividad: ${task.text}</div>
        <div>Inicio: ${gantt.templates.tooltip_date_format(start)}</div>
        <div>Fin: ${gantt.templates.tooltip_date_format(end)}</div>
        <div>Progreso: ${(task.progress! * 100).toFixed(2)} % </div>
        <div>Tiene impedimento: ${task["with_impediment"] ? "Si" : "No"}</div>
        `;

      }
    };
    gantt.config.readonly = true;
    gantt.i18n.setLocale("es");
    gantt.templates.date_grid = (start: Date) => {
      return dateToString(start);
    }
    gantt.templates.task_date = (date: Date) => {
      return dateToString(date);
    };

    gantt.init(this.ganttContainer.nativeElement);
    gantt.parse({ data });
    gantt.refreshData();
    gantt.render();
  }

  ngOnInit(): void {
    this.reportsService.getProjects().subscribe({
      next: (data) => {
        this.projects = data.projects;
        this.sprints = data.sprints;

        this.ganttForm = new FormGroup({
          selectedProjects: new FormControl<Project[] | null>(this.projects),
          selectedSprints: new FormControl<Sprint[] | null>(this.sprints)
        });
      }
    }
    );


  }

  getIssues() {
    this.isLoading = true;
    this.isLoaded = false;
    let projects = this.ganttForm.value.selectedProjects?.map((p: Project) => p.name).join('","');
    let sprints = this.ganttForm.value.selectedSprints?.map((s: Sprint) => s.name).join('","')

    gantt.clearAll();
    this.reportsService.getGanttProgress(`"${projects}"`, `"${sprints}"`).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.isLoaded = true;
        //gantt.destructor
        this.initGantt(data);
      }
    });
  }
}

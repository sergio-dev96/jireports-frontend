import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { ReportsService } from '../../service/reports.service';
import { gantt } from 'dhtmlx-gantt';
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


  @ViewChild('ganttDiagram', { static: true }) ganttContainer!: ElementRef;


  constructor() { 
   
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
      }}
    );

    gantt.config.date_format = '%d/%m/%Y';
    let columns = [
      { name: 'text', tree: true, width: "*", resize: true },
      { name: 'start_date', label: 'Inicio', align: 'center', resize: true, width: 100 },
      { name: 'duration', label: 'SP', align: 'center', width: 50, resize: true }
    ]
    gantt.config.columns = columns;
    gantt.init(this.ganttContainer.nativeElement);
    gantt.config.readonly = true;
  }

  getIssues(){
    this.isLoading = true;
    this.isLoaded = false;
    let projects = this.ganttForm.value.selectedProjects?.map((p: Project) => p.name).join('","');
    let sprints = this.ganttForm.value.selectedSprints?.map((s: Sprint) => s.name).join('","')
    console.log( );

    this.reportsService.getGanttProgress(`"${projects}"`, `"${sprints}"`).subscribe({
      next: (data) => {
        gantt.parse({ data });
        this.isLoading = false;
        this.isLoaded = true;
      }
    });
  }
}

import { Component, OnInit, inject, ViewChild, ElementRef, viewChild } from '@angular/core';
import { ReportsService } from '../../service/reports.service';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Project, Sprint } from '../../../core/interfaces/gantt-interfaces';
import { NgxGanttModule } from '../../../ngx-gantt/gantt.module';
import { GanttItem, GanttToolbarOptions, GanttViewType } from '../../../ngx-gantt/class';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { NgxGanttComponent } from '../../../ngx-gantt/gantt.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-gantt-progress',
  imports: [SelectModule, IftaLabelModule, ButtonModule, ReactiveFormsModule, NgxGanttModule,
    CommonModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './gantt-progress.component.html',
  styleUrl: './gantt-progress.component.scss'
})
export class GanttProgressComponent implements OnInit {
  reportsService = inject(ReportsService);

  @ViewChild('gantt') gantt!: NgxGanttComponent;

  ganttForm: FormGroup = new FormGroup({
    selectedProjects: new FormControl<Project | null>(null),
    selectedSprints: new FormControl<Sprint | null>(null)
  });
  isLoading: boolean = false;
  isLoaded: boolean = false;

  projects: Project[] = [];
  sprints: Sprint[] = [];

  items: GanttItem[] = [];
  toolbarOptions: GanttToolbarOptions = {
    viewTypes: [
      GanttViewType.hour,
      GanttViewType.day,
      GanttViewType.week,
      GanttViewType.month,
      GanttViewType.quarter,
      GanttViewType.year
    ]
  };

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.reportsService.getProjects().subscribe({
      next: (data) => {
        this.projects = data.projects;
        this.sprints = data.sprints;
      }
    }
    );
  }

  getIssues() {
    this.isLoading = true;
    this.isLoaded = false;
    let projects = this.ganttForm.value.selectedProjects?.name;
    let sprints = this.ganttForm.value.selectedSprints?.name;

    this.reportsService.getGanttProgress(`"${projects}"`, `"${sprints}"`).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.isLoaded = true;
        this.items = data;
        this.gantt.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.isLoaded = true;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al cargar los datos' });
      },
    });
  }

  get getViewType(): GanttViewType {
    return GanttViewType.day;
  }
}

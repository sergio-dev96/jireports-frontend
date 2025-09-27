import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { ReportsService } from '../../service/reports.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Project, Sprint } from '../../../core/interfaces/gantt-interfaces';
import { NgxGanttModule } from '../../../ngx-gantt/gantt.module';
import { GanttEventType, GanttItem, GanttViewType } from '../../../ngx-gantt/class';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";


@Component({
  selector: 'app-gantt-progress',
  imports: [MultiSelectModule, IftaLabelModule, ButtonModule, ReactiveFormsModule, NgxGanttModule, CommonModule, TagModule],
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

  items: GanttItem[] = [];


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
      }
    }
    );
  }

  getIssues() {
    this.isLoading = true;
    this.isLoaded = false;
    let projects = this.ganttForm.value.selectedProjects?.map((p: Project) => p.name).join('","');
    let sprints = this.ganttForm.value.selectedSprints?.map((s: Sprint) => s.name).join('","')

    this.reportsService.getGanttProgress(`"${projects}"`, `"${sprints}"`).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.isLoaded = true;
        this.items = data;
      }
    });
  }

  get getViewType(): GanttViewType {
    return GanttViewType.day;
  }
}

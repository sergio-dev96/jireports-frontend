import { Component, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { Project } from '../../../core/interfaces/gantt-interfaces';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from '../../service/reports.service';

@Component({
  selector: 'app-resumen-version',
  imports: [ReactiveFormsModule,ChartModule, FluidModule,SelectModule,IftaLabelModule,ButtonModule],
  templateUrl: './resumen-version.component.html',
  styleUrl: './resumen-version.component.scss'
})
export class ResumenVersionComponent implements OnInit {
  barPointData: any;
  pieData: any;
  barOptions: any;
  pieOptions: any;

  isLoading: boolean = false;
  isLoaded: boolean = false;

  versions : number[] = [1,2,3,4,5,6,7,8,9]
  projects: Project[] = [];

  reportsService = inject(ReportsService);

  resumeForm: FormGroup = new FormGroup({
    selectedProjects: new FormControl<Project | null>(null),
    selectedVersion: new FormControl<number | null>(null)
  });

  ngOnInit() {
    this.reportsService.getProjects().subscribe({
      next: (data) => {
        this.projects = data.projects;
      }
    }
    );


    this.initCharts();
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.barPointData = {
      labels: ['Funcionalidad1', 'Funcionalidad2', 'Funcionalidad3', 'Funcionalidad4', 'Funcionalidad5', 'Funcionalidad6', 'Funcionalidad7'],
      datasets: [
        {
          label: 'N° de actividades',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
          borderColor: documentStyle.getPropertyValue('--p-primary-500'),
          data: [2, 3, 6, 4, 5, 1, 3]
        }
      ]
    };

    this.barOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.pieData = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [documentStyle.getPropertyValue('--p-indigo-500'), documentStyle.getPropertyValue('--p-purple-500'), documentStyle.getPropertyValue('--p-teal-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-teal-400')]
        }
      ]
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }

  getResume(){

  }
}



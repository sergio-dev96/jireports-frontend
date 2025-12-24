import { Component, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { Project } from '../../../core/interfaces/gantt-interfaces';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from '../../service/reports.service';

@Component({
  selector: 'app-resumen-version',
  imports: [ReactiveFormsModule,ChartModule, FluidModule,SelectModule,IftaLabelModule,ButtonModule,SkeletonModule],
  templateUrl: './resumen-version.component.html',
  styleUrl: './resumen-version.component.scss'
})
export class ResumenVersionComponent implements OnInit {
  barStoryPointsData: any;
  barPointsData: any;

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

  /* Resume vars*/
  rangeDate: string = '';
  totalPoints: string = '';
  projectPoints: number = 0;
  offProjectPoints: number = 0;

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
              weight: 400
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

    

    this.pieOptions = {
      plugins: {
        legend: null
      }
    };
  }

  getResume(){
    let projects = this.resumeForm.value.selectedProjects?.name;
    let version = this.resumeForm.value.selectedVersion;
    this.isLoaded = true;
    this.isLoading = true;

    this.reportsService.getProjectVersionProgress(`"${projects}"`, `"${version}"`).subscribe({
      next: (data) => {
        console.log(data);
        const documentStyle = getComputedStyle(document.documentElement);
    
        this.barStoryPointsData = {
          labels: data.on_project.labels,
          datasets: [
            {
              label: 'Puntos consumidos',
              // backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
              // borderColor: documentStyle.getPropertyValue('--p-primary-500'),
              data: data.on_project.data
            }
          ]
        };
    
        this.barPointsData = {
          labels: data.off_project.labels,
          datasets: [
            {
              label: 'Puntos consumidos',
              // backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
              // borderColor: documentStyle.getPropertyValue('--p-primary-500'),
              data: data.off_project.data
            }
          ]
        };
        this.rangeDate = `${data.start} - ${data.end}`;
        this.totalPoints = (data.on_project.total + data.off_project.total).toFixed(2);
        this.projectPoints = data.on_project.total;
        this.offProjectPoints = data.off_project.total;
        this.pieData = {
          labels: ['Puntos del proyecto', 'Puntos fuera del proyecto'],
          datasets: [
            {
              data: [data.on_project.total, data.off_project.total],
              backgroundColor: [documentStyle.getPropertyValue('--p-indigo-500'), documentStyle.getPropertyValue('--p-purple-500')],
              hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400')]
            }
          ]
        };

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false ;
      },
    });
    
    

  }
}



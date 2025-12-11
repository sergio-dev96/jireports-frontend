import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { RetrasadosComponent } from './reports/retrasados/retrasados.component';
import { GanttProgressComponent } from './reports/gantt-progress/gantt-progress.component';
import { ResumenVersionComponent } from './reports/resumen-version/resumen-version.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'retrasado', component: RetrasadosComponent },
    { path: 'gantt-progress', component: GanttProgressComponent },
    { path: 'resumen-version', component: ResumenVersionComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;

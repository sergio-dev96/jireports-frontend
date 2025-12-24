import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NewTask } from 'dhtmlx-gantt';
import { GanttItem } from '../../ngx-gantt/class';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private http = inject(HttpClient);

  constructor() { }

  getRetrasados(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/jira/delay-tasks`);
  }

  getGanttProgress(projects: string, sprints: string): Observable<GanttItem[]> {
    return this.http.get<any>(`${environment.apiUrl}/jira/gantt-progress`,
      { params: { projects, sprints } });
  }

  getProjectVersionProgress(projects: string, version: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/jira/version-progress`,
      { params: { projects, version } });
  }

  getProjects(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/jira/projects`);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private http = inject(HttpClient);

  constructor() { }

  getRetrasados(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/jira/delay-tasks`);
  }

  getGanttProgress(projects:string,sprints : string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/jira/gantt-progress`,
      {params: {projects, sprints}});
  }

  getProjects(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/jira/projects`);
  }
}

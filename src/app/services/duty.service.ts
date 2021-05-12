import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Duty } from '../models/duty';

@Injectable({
  providedIn: 'root'
})
export class DutyService {

  // #region constructor

  constructor(
    private http: HttpClient
  ) { }

  // #endregion

  // #region métodos

  public getAllDuties(): Observable<Duty[]> {
    return this.http.get<Duty[]>(environment.apiDutyUrl);
  }

  public getById(id: string): Observable<Duty> {
    return this.http.get<Duty>(`${environment.apiDutyUrl}/${id}`);
  }

  public deleteDuty(id: string): Observable<any> {
    return this.http.delete(`${environment.apiDutyUrl}/${id}`);
  }

  public addDuty(duty: Duty): Observable<Duty> {
    return this.http.post<Duty>(environment.apiDutyUrl, duty);
  }

  public updateDuty(duty: Duty): Observable<Duty> {
    return this.http.put<Duty>(environment.apiDutyUrl, duty);
  }

  // #endregion
}

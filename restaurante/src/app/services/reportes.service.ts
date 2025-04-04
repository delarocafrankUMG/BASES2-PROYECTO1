import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) { }

  getReporte(viewName: string) {
    return this.http.get<any[]>(`${this.apiUrl}/${viewName}`);
  }
}

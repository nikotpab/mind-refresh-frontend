import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/events';

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(event: any): Observable<any> {
    return this.http.post(this.apiUrl, event);
  }

  update(id: string, event: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, event);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

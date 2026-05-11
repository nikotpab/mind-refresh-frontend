import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/events';

  private getNoCacheHeaders() {
    return {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      })
    };
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getNoCacheHeaders());
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

  invite(eventId: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/invite`, { email });
  }

  enroll(eventId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/enroll`, {});
  }
}

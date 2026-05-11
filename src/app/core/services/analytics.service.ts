import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/analytics`;

  private getNoCacheHeaders() {
    return {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      })
    };
  }

  getSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`, this.getNoCacheHeaders());
  }

  getTeamMood(): Observable<any> {
    return this.http.get(`${this.apiUrl}/team-mood`, this.getNoCacheHeaders());
  }

  getSentimentAnalysis(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sentiment`, this.getNoCacheHeaders());
  }

  getStrategicStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/strategic`, this.getNoCacheHeaders());
  }
}

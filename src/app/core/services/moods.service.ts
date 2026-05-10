import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoodsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/moods';

  create(mood: any): Observable<any> {
    return this.http.post(this.apiUrl, mood);
  }

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

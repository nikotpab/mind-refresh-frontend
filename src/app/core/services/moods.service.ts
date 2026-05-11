import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoodsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/moods`;

  create(mood: any): Observable<any> {
    return this.http.post(this.apiUrl, mood);
  }

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/notifications';

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  markAsRead(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/read`, {});
  }

  shareQuote(email: string, quote: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/share`, {
      email,
      message: quote,
      title: 'Te han enviado una frase inspiradora ✨',
      type: 'QUOTE_SHARED'
    });
  }
}

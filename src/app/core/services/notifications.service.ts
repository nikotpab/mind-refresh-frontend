import { Injectable, inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '../auth/auth';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private zone = inject(NgZone);
  private apiUrl = 'http://localhost:3000/api/v1/notifications';
  private socket: Socket | null = null;

  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private newNotificationSubject = new Subject<any>();
  public newNotification$ = this.newNotificationSubject.asObservable();

  constructor() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.initSocket(user.id);
        this.loadNotifications();
      } else {
        this.disconnectSocket();
      }
    });
  }

  private initSocket(userId: string) {
    if (this.socket) return;
    
    this.socket = io('http://localhost:3000', {
      query: { userId }
    });

    this.socket.on('notification', (notification: any) => {
      this.zone.run(() => {
        const current = this.notificationsSubject.value;
        // Prevent duplicates
        if (!current.some(n => n.id === notification.id)) {
          this.notificationsSubject.next([notification, ...current]);
          this.newNotificationSubject.next(notification);
        }
      });
    });
  }

  private disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  loadNotifications() {
    this.http.get<any[]>(this.apiUrl).subscribe(notifications => {
      this.notificationsSubject.next(notifications);
    });
  }

  getNotifications(): Observable<any[]> {
    return this.notifications$;
  }

  markAsRead(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const current = this.notificationsSubject.value;
        const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
        this.notificationsSubject.next(updated);
      })
    );
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

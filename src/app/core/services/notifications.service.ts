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

  private selectedNotificationSubject = new BehaviorSubject<any>(null);
  public selectedNotification$ = this.selectedNotificationSubject.asObservable();

  constructor() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        console.log('NotificationsService: User logged in, initializing...', user.id);
        this.initSocket(user.id);
        this.loadNotifications();
      } else {
        console.log('NotificationsService: User logged out, disconnecting socket');
        this.disconnectSocket();
        this.notificationsSubject.next([]);
        this.selectedNotificationSubject.next(null);
      }
    });
  }

  private initSocket(userId: string) {
    if (this.socket) {
      console.log('NotificationsService: Socket already initialized');
      return;
    }
    
    console.log('NotificationsService: Connecting to socket.io...');
    this.socket = io(environment.wsUrl || '/', {
      query: { userId }
    });

    this.socket.on('connect', () => {
      console.log('NotificationsService: Socket connected successfully');
    });

    this.socket.on('connect_error', (error) => {
      console.error('NotificationsService: Socket connection error:', error);
    });

    this.socket.on('notification', (notification: any) => {
      console.log('NotificationsService: New notification received via socket:', notification);
      
      // Clean up message
      if (notification.message) {
        notification.message = notification.message
          .replace(/undefined/g, 'Un compañero')
          .replace(/^"|"$/g, '') // Remove starting/ending quotes
          .trim();
      }

      this.zone.run(() => {
        const current = this.notificationsSubject.value;
        // Prevent duplicates
        if (!current.some(n => n.id === notification.id)) {
          const updated = [notification, ...current];
          this.notificationsSubject.next(updated);
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
    console.log('NotificationsService: Loading notifications from API...');
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (notifications) => {
        // Clean up messages: replace 'undefined' and remove surrounding quotes
        const cleaned = notifications.map(n => ({
          ...n,
          message: n.message
            ?.replace(/undefined/g, 'Un compañero')
            ?.replace(/^"|"$/g, '')
            ?.trim()
        }));

        console.log('NotificationsService: Loaded notifications from API:', cleaned.length);
        this.zone.run(() => {
          this.notificationsSubject.next(cleaned);
        });
      },
      error: (err) => {
        console.error('NotificationsService: Error loading notifications', err);
      }
    });
  }

  getNotifications(): Observable<any[]> {
    return this.notifications$;
  }

  setSelectedNotification(notification: any) {
    this.zone.run(() => {
      this.selectedNotificationSubject.next(notification);
    });
  }

  markAsRead(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        this.zone.run(() => {
          const current = this.notificationsSubject.value;
          const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
          this.notificationsSubject.next(updated);
          
          // Also update selected if it's the one being marked
          const selected = this.selectedNotificationSubject.value;
          if (selected && selected.id === id) {
            this.selectedNotificationSubject.next({ ...selected, read: true });
          }
        });
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
spiradora ✨',
      type: 'QUOTE_SHARED'
    });
  }
}

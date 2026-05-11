import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth';
import { NotificationsService } from '../../core/services/notifications.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class Topbar implements OnInit, OnDestroy {
  profileMenuOpen = false;
  private authService = inject(AuthService);
  private notificationsService = inject(NotificationsService);
  private cdr = inject(ChangeDetectorRef);
  currentUser$ = this.authService.currentUser$;
  notifications: any[] = [];
  notificationsOpen = false;
  activeFilter: 'ALL' | 'EVENT_GENERAL' | 'EVENT_INVITATION' | 'QUOTE_SHARED' = 'ALL';
  private sub: Subscription | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.sub = this.notificationsService.notifications$.subscribe(data => {
      this.notifications = data;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  setFilter(filter: any) {
    this.activeFilter = filter;
  }

  get filteredNotifications() {
    if (this.activeFilter === 'ALL') return this.notifications;
    return this.notifications.filter(n => n.type === this.activeFilter);
  }

  toggleNotifications() {
    this.notificationsOpen = !this.notificationsOpen;

    if (this.notificationsOpen) {
      this.profileMenuOpen = false;

      const unread = this.notifications.filter(n => !n.read);
      unread.forEach(n => {
        this.notificationsService.markAsRead(n.id).subscribe();
      });
    }
  }

  viewNotification(notification: any) {
    this.notificationsOpen = false;
    this.notificationsService.setSelectedNotification(notification);
    
    if (!notification.read) {
      this.notificationsService.markAsRead(notification.id).subscribe();
    }
  }

  markAsRead(notification: any) {
    if (!notification.read) {
      this.notificationsService.markAsRead(notification.id).subscribe();
    }
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get pageTitle(): string {
    const url = this.router.url;
    if (url.includes('collaborator-dashboard')) return 'Dashboard';
    if (url.includes('sentiment-analytics')) return 'Sentiment Insights';
    if (url.includes('event-catalog')) return 'Event Catalog';
    if (url.includes('event-management')) return 'Event Management';
    if (url.includes('strategic-dashboard')) return 'Executive Dashboard';
    if (url.includes('profile')) return 'User Profile';
    if (url.includes('notifications')) return 'Notifications';
    return 'Mind Refresh';
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  logout(): void {
    this.profileMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
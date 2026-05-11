import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Topbar } from '../../components/topbar/topbar';
import { NotificationsService } from '../../core/services/notifications.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Topbar, CommonModule],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css']
})
export class DashboardLayout implements OnInit, OnDestroy {
  private notificationsService = inject(NotificationsService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  selectedNotification: any = null;
  private sub: Subscription | null = null;

  ngOnInit() {
    this.sub = this.notificationsService.selectedNotification$.subscribe(n => {
      this.zone.run(() => {
        this.selectedNotification = n;
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  closeNotification() {
    this.notificationsService.setSelectedNotification(null);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'QUOTE_SHARED': return 'format_quote';
      case 'EVENT_GENERAL': return 'calendar_today';
      case 'EVENT_INVITATION': return 'mail';
      case 'EVENT_REGISTRATION': return 'how_to_reg';
      default: return 'notifications';
    }
  }

  getBadgeClass(type: string): string {
    switch (type) {
      case 'QUOTE_SHARED': return 'bg-secondary/10 text-secondary';
      case 'EVENT_GENERAL': return 'bg-primary/10 text-primary';
      case 'EVENT_INVITATION': return 'bg-tertiary/10 text-tertiary';
      case 'EVENT_REGISTRATION': return 'bg-primary/10 text-primary';
      default: return 'bg-outline-variant/10 text-on-surface-variant';
    }
  }
}

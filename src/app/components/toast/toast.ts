import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../core/services/notifications.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-24 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <div *ngFor="let toast of toasts" 
           class="pointer-events-auto bg-surface p-4 rounded-xl flex gap-4 items-center min-w-[320px] shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.7)] border border-white/20 animate-slide-in">
        <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
             [class.bg-primary/10]="toast.type === 'EVENT_GENERAL'"
             [class.bg-tertiary/10]="toast.type === 'EVENT_INVITATION'"
             [class.bg-secondary/10]="toast.type === 'QUOTE_SHARED'">
          <span class="material-symbols-outlined text-xl" 
                [class.text-primary]="toast.type === 'EVENT_GENERAL'"
                [class.text-tertiary]="toast.type === 'EVENT_INVITATION'"
                [class.text-secondary]="toast.type === 'QUOTE_SHARED'">
            {{ toast.type === 'QUOTE_SHARED' ? 'format_quote' : 'notifications' }}
          </span>
        </div>
        <div class="flex-1">
          <p class="text-xs font-bold text-on-surface mb-0.5">{{ toast.title }}</p>
          <p class="text-[11px] text-on-surface-variant leading-tight line-clamp-2">{{ toast.message }}</p>
        </div>
        <button (click)="removeToast(toast)" class="text-on-surface-variant hover:text-on-surface p-1">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  private notificationsService = inject(NotificationsService);
  private cdr = inject(ChangeDetectorRef);
  toasts: any[] = [];
  private sub: Subscription | null = null;

  ngOnInit() {
    this.sub = this.notificationsService.newNotification$.subscribe(notification => {
      console.log('Toast component received new notification:', notification);
      this.addToast(notification);
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  addToast(notification: any) {
    const toast = { ...notification };
    this.toasts.push(toast);
    this.cdr.detectChanges(); // IMPORTANTE: Forzar detección de cambios para ver el toast inmediatamente

    // Auto-remove after 6 seconds
    setTimeout(() => {
      this.removeToast(toast);
    }, 6000);
  }

  removeToast(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
    this.cdr.detectChanges();
  }
}

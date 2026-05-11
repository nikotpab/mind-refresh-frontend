import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
import { AuthService } from '../../core/auth/auth';
import { CommonModule } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-catalog.html',
  styleUrl: './event-catalog.css',
})
export class EventCatalog {
  private eventsService = inject(EventsService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  
  events$: Observable<any[]> = this.eventsService.getAll().pipe(
    map(data => Array.isArray(data) ? data : []),
    startWith([])
  );

  showInviteModal = false;
  selectedEvent: any = null;
  inviteEmail = '';
  inviteStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  
  enrollStatus: Record<string, 'idle' | 'loading' | 'success' | 'error' | 'already'> = {};

  refreshCatalog() {
    this.events$ = this.eventsService.getAll().pipe(
      map(data => Array.isArray(data) ? data : []),
      startWith([])
    );
  }

  isEnrolled(event: any): boolean {
    const user = this.authService.getCurrentUser();
    if (!user || !event.participants) return false;
    return event.participants.includes(user.id);
  }

  openInviteModal(event: any) {
    this.selectedEvent = event;
    this.showInviteModal = true;
    this.inviteEmail = '';
    this.inviteStatus = 'idle';
  }

  closeInviteModal() {
    this.showInviteModal = false;
    this.selectedEvent = null;
    this.cdr.detectChanges();
  }

  sendInvite() {
    if (!this.inviteEmail || !this.selectedEvent) return;

    const email = this.inviteEmail.trim().toLowerCase();
    this.inviteStatus = 'loading';
    this.cdr.detectChanges();

    this.eventsService.invite(this.selectedEvent.id, email).subscribe({
      next: () => {
        this.inviteStatus = 'success';
        this.cdr.detectChanges();
        setTimeout(() => this.closeInviteModal(), 1500);
      },
      error: (err) => {
        console.error('Error inviting user', err);
        if (err.status === 404) {
          alert('El usuario no está registrado en Mind Refresh.');
        }
        this.inviteStatus = 'error';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.inviteStatus = 'idle';
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }

  enroll(event: any) {
    const eventId = event.id;
    if (this.enrollStatus[eventId] === 'loading' || this.isEnrolled(event)) return;

    this.enrollStatus = { ...this.enrollStatus, [eventId]: 'loading' };
    this.cdr.detectChanges();

    this.eventsService.enroll(eventId).subscribe({
      next: (res) => {
        console.log('[EventCatalog] SUCCESS:', res);
        this.enrollStatus = { ...this.enrollStatus, [eventId]: 'success' };
        this.cdr.detectChanges();
        
        // Refresh catalog to update participants list from server
        setTimeout(() => {
          this.refreshCatalog();
          this.enrollStatus = { ...this.enrollStatus, [eventId]: 'idle' };
        }, 1500);
      },
      error: (err) => {
        console.error('[EventCatalog] ERROR:', err);
        this.enrollStatus = { ...this.enrollStatus, [eventId]: 'error' };
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.enrollStatus = { ...this.enrollStatus, [eventId]: 'idle' };
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }
}



import { Component, inject, OnInit } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-management.html',
  styleUrl: './event-management.css',
})
export class EventManagement implements OnInit {
  private eventsService = inject(EventsService);
  private analyticsService = inject(AnalyticsService);
  private fb = inject(FormBuilder);

  events: any[] = [];
  teamMood: any = null;
  showForm = false;
  isEditing = false;
  isSubmitting = false;
  editingId: string | null = null;

  eventForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required],
    facilitator: [''],
    location: ['Virtual'],
    resources: [''],
    targetDepartment: ['']
  });

  ngOnInit() {
    this.loadEvents();
    this.loadAnalytics();
  }

  loadEvents() {
    this.eventsService.getAll().subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error('Error fetching events', err)
    });
  }

  loadAnalytics() {
    this.analyticsService.getTeamMood().subscribe({
      next: (data) => this.teamMood = data,
      error: (err) => console.error('Error fetching analytics', err)
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.isEditing = false;
    this.editingId = null;
    this.eventForm.reset({ location: 'Virtual' });
  }

  editEvent(event: any) {
    this.isEditing = true;
    this.editingId = event.id;
    this.showForm = true;
    this.eventForm.patchValue({
      title: event.title,
      description: event.description,
      date: event.date,
      facilitator: event.facilitator,
      location: event.location || 'Virtual',
      resources: event.resources ? event.resources.join(', ') : '',
      targetDepartment: event.targetDepartment
    });
  }

  onSubmit() {
    console.log('[EventManagement] --- SUBMIT CLICKED ---');
    console.log('[EventManagement] Form Valid:', this.eventForm.valid);
    console.log('[EventManagement] Form Value:', this.eventForm.value);

    if (this.eventForm.invalid) {
      console.warn('[EventManagement] Form is invalid');
      this.eventForm.markAllAsTouched();
      return;
    }

    const formValue = this.eventForm.getRawValue();
    const data = {
      title: formValue.title,
      description: formValue.description,
      date: formValue.date,
      facilitator: formValue.facilitator || '',
      location: formValue.location || 'Virtual',
      targetDepartment: formValue.targetDepartment || '',
      resources: formValue.resources ? formValue.resources.split(',').map((r: string) => r.trim()).filter((r: string) => r !== '') : []
    };

    this.isSubmitting = true;
    console.log('[EventManagement] Sending payload to backend:', data);

    this.eventsService.create(data).subscribe({
      next: (res) => {
        console.log('[EventManagement] SERVER SUCCESS:', res);
        this.isSubmitting = false;
        this.loadEvents();
        this.toggleForm();
      },
      error: (err) => {
        console.error('[EventManagement] SERVER ERROR:', err);
        this.isSubmitting = false;
      }
    });
  }

  applyRecommendation() {
    if (this.teamMood?.recommendation) {
      this.eventForm.patchValue({
        targetDepartment: this.teamMood.recommendation.department
      });
    }
  }

  deleteEvent(id: string) {
    if (confirm('¿Está seguro de eliminar este evento?')) {
      this.eventsService.delete(id).subscribe({
        next: () => this.loadEvents(),
        error: (err) => console.error('Error deleting event', err)
      });
    }
  }
}


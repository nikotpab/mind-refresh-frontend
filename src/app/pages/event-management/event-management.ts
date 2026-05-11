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
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      const data = {
        ...formValue,
        resources: formValue.resources ? formValue.resources.split(',').map(r => r.trim()) : []
      };

      if (this.isEditing && this.editingId) {
        this.eventsService.update(this.editingId, data).subscribe({
          next: () => {
            this.loadEvents();
            this.toggleForm();
          },
          error: (err) => console.error('Error updating event', err)
        });
      } else {
        this.eventsService.create(data).subscribe({
          next: () => {
            this.loadEvents();
            this.toggleForm();
          },
          error: (err) => console.error('Error creating event', err)
        });
      }
    }
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


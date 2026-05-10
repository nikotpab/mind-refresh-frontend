import { Component, inject, OnInit } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
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
  private fb = inject(FormBuilder);

  events: any[] = [];
  showForm = false;
  isEditing = false;
  editingId: string | null = null;

  eventForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required],
    facilitator: [''],
    targetDepartment: ['']
  });

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventsService.getAll().subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error('Error fetching events', err)
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
    this.eventForm.reset();
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
      targetDepartment: event.targetDepartment
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const data = this.eventForm.value;
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

  deleteEvent(id: string) {
    if (confirm('¿Está seguro de eliminar este evento?')) {
      this.eventsService.delete(id).subscribe({
        next: () => this.loadEvents(),
        error: (err) => console.error('Error deleting event', err)
      });
    }
  }
}

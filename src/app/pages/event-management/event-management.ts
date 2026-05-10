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

  eventForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required]
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

  onSubmit() {
    if (this.eventForm.valid) {
      this.eventsService.create(this.eventForm.value).subscribe({
        next: () => {
          this.loadEvents();
          this.showForm = false;
          this.eventForm.reset();
        },
        error: (err) => console.error('Error creating event', err)
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

import { Component, inject, OnInit } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-catalog.html',
  styleUrl: './event-catalog.css',
})
export class EventCatalog implements OnInit {
  private eventsService = inject(EventsService);
  events: any[] = [];

  ngOnInit() {
    this.eventsService.getAll().subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error('Error fetching events', err)
    });
  }
}

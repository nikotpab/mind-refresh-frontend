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

  inviteUser(event: any) {
    const email = window.prompt(`¿A quién quieres invitar a "${event.title}"? (Ingresa su correo)`);
    if (email && email.trim()) {
      this.eventsService.invite(event.id, email.trim()).subscribe({
        next: () => {
          alert('¡Invitación enviada con éxito! 📩');
        },
        error: (err) => {
          console.error('Error inviting user', err);
          alert('No se pudo enviar la invitación. Asegúrate de que el correo sea válido.');
        }
      });
    }
  }
}

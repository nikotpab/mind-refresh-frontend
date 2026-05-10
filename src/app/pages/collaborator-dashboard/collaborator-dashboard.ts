import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth';
import { AnalyticsService } from '../../core/services/analytics.service';
import { EventsService } from '../../core/services/events.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-collaborator-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './collaborator-dashboard.html',
  styleUrl: './collaborator-dashboard.css',
})
export class CollaboratorDashboard implements OnInit {
  private authService = inject(AuthService);
  private analyticsService = inject(AnalyticsService);
  private eventsService = inject(EventsService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  user: any = null;
  summary: any = null;
  suggestedEvents: any[] = [];
  hasCheckedInToday = false;
  dailyQuote: string = 'La calma es la cuna del poder. Tómate un momento para respirar y reconectar.';

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadQuote();
    
    this.analyticsService.getSummary().subscribe({
      next: (data) => {
        console.log('Received summary data:', data);
        this.summary = data;
        if (data && data.lastMoods && data.lastMoods.length > 0) {
          const lastDate = new Date(data.lastMoods[0].createdAt);
          const today = new Date();
          
          // Consider checked in if the last mood was created within the last 16 hours
          // This avoids edge cases with midnight and timezone shifts between server/client
          const diffHours = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
          if (diffHours < 16 && lastDate.getDate() === today.getDate()) {
            this.hasCheckedInToday = true;
          } else {
            // Also fallback to the exact local date string just in case
            this.hasCheckedInToday = lastDate.toDateString() === today.toDateString();
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching summary', err)
    });

    this.eventsService.getAll().subscribe({
      next: (data) => {
        this.suggestedEvents = data.slice(0, 3);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching events', err)
    });
  }

  loadQuote() {
    this.http.get<any>('/quotes.json').subscribe({
      next: (data) => {
        const quotes = data.bienestar_laboral;
        if (quotes && quotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * quotes.length);
          this.dailyQuote = quotes[randomIndex];
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error loading quotes', err)
    });
  }

  getEmotionEmoji(emotion: string): string {
    const emojis: any = {
      sentiment_very_dissatisfied: '😫',
      sentiment_dissatisfied: '🙁',
      sentiment_neutral: '😐',
      sentiment_satisfied: '😊',
      sentiment_very_satisfied: '😁'
    };
    return emojis[emotion] || '😐';
  }
}

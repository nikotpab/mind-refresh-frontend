import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../core/services/analytics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sentiment-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sentiment-analytics.html',
  styleUrl: './sentiment-analytics.css',
})
export class SentimentAnalytics implements OnInit {
  private analyticsService = inject(AnalyticsService);
  stats: any = null;

  ngOnInit() {
    this.analyticsService.getSentimentAnalysis().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error fetching sentiment analytics', err)
    });
  }

  formatKey(key: any): string {
    return String(key).replace('sentiment_', '').replace('_', ' ');
  }
}

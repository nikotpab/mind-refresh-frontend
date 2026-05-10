import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../core/services/analytics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-strategic-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './strategic-dashboard.html',
  styleUrl: './strategic-dashboard.css',
})
export class StrategicDashboard implements OnInit {
  private analyticsService = inject(AnalyticsService);
  stats: any = null;

  ngOnInit() {
    this.analyticsService.getStrategicStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error fetching strategic stats', err)
    });
  }

  formatKey(key: any): string {
    return String(key).replace('sentiment_', '').replace('_', ' ');
  }
}

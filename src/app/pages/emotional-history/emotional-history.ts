import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoodsService } from '../../core/services/moods.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-emotional-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './emotional-history.html',
  styleUrls: ['./emotional-history.css']
})
export class EmotionalHistory implements OnInit {
  private moodsService = inject(MoodsService);
  private cdr = inject(ChangeDetectorRef);
  
  history: any[] = [];
  loading = true;

  ngOnInit() {
    console.log('EmotionalHistory component initialized');
    this.moodsService.getHistory().subscribe({
      next: (data) => {
        console.log('Received history data:', data);
        // Sort history by date descending with safe date parsing
        this.history = data.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching history', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
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

  getEmotionLabel(emotion: string): string {
    const labels: any = {
      sentiment_very_dissatisfied: 'Muy triste',
      sentiment_dissatisfied: 'Triste',
      sentiment_neutral: 'Neutral',
      sentiment_satisfied: 'Feliz',
      sentiment_very_satisfied: 'Muy feliz'
    };
    return labels[emotion] || 'Desconocido';
  }
}

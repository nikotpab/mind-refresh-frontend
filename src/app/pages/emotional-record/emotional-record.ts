import { RouterLink, Router } from '@angular/router';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { MoodsService } from '../../core/services/moods.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emotional-record',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './emotional-record.html',
  styleUrl: './emotional-record.css',
})
export class EmotionalRecord {
  private moodsService = inject(MoodsService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  selectedEmotion: string = '';
  notes: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  selectEmotion(emotion: string) {
    this.selectedEmotion = emotion;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  submit() {
    if (!this.selectedEmotion) {
        return;
    }
    const data = {
      emotion: this.selectedEmotion,
      notes: this.notes
    };
    this.moodsService.create(data).subscribe({
      next: () => {
        this.successMessage = '¡Registro guardado con éxito!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/collaborator-dashboard']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error saving mood', err);
        if (err.status === 400) {
          this.errorMessage = 'Ya has registrado tu estado de ánimo hoy.';
        } else {
          this.errorMessage = 'Hubo un error al guardar. Intenta de nuevo.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}

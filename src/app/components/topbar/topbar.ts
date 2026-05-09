import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class Topbar {
  profileMenuOpen = false;
  private authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  constructor(private router: Router) {}

  get pageTitle(): string {
    const url = this.router.url;
    if (url.includes('collaborator-dashboard')) return 'Dashboard';
    if (url.includes('sentiment-analytics')) return 'Sentiment Insights';
    if (url.includes('event-catalog')) return 'Event Catalog';
    if (url.includes('event-management')) return 'Event Management';
    if (url.includes('strategic-dashboard')) return 'Executive Dashboard';
    if (url.includes('profile')) return 'User Profile';
    return 'Mind Refresh';
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  logout(): void {
    this.profileMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

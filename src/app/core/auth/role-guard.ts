import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const user = this.authService.getCurrentUser();
    const expectedRole = route.data['role'];

    if (user && user.role === expectedRole) {
      return true;
    }

    // Redirect to default dashboard if not authorized
    alert('Access Denied: You do not have permission to view this page.');
    return this.router.parseUrl('/collaborator-dashboard');
  }
}

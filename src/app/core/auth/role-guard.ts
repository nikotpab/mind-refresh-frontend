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
    const allowedRoles = route.data['roles'] as Array<string>;

    if (!user) {
      return this.router.parseUrl('/login');
    }

    if (!allowedRoles || allowedRoles.includes(user.role)) {
      return true;
    }

    // Redirect to default dashboard if not authorized
    alert(`Acceso Denegado: Su rol de '${user.role}' no tiene permiso para ver esta página.`);
    return this.router.parseUrl('/collaborator-dashboard');
  }
}

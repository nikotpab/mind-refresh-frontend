import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const user = sessionStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((response: any) => {
        if (response && response.message === 'Login successful') {
          const userObj = { email: response.email, role: response.role, id: response.id };
          sessionStorage.setItem('user', JSON.stringify(userObj));
          this.currentUserSubject.next(userObj);
        } else if (response && response.user) {
          sessionStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, { withCredentials: true });
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => console.log('Logged out from server'),
      error: (err) => console.error('Logout error', err)
    });
    sessionStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  updateUser(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  get isAuthenticated(): boolean {
    return !!sessionStorage.getItem('user');
  }

  getToken(): string | null {
    return null; // Token is managed via HttpOnly cookies
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}

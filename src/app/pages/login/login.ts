import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogin = true;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    name: [''],
    role: ['Colaborador']
  });

  error: string = '';

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = '';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const data = this.loginForm.value;
      if (this.isLogin) {
        this.authService.login({ email: data.email, password: data.password }).subscribe({
          next: () => {
            this.router.navigate(['/collaborator-dashboard']);
          },
          error: (err) => {
            this.error = 'Credenciales inválidas. Intente de nuevo.';
            console.error(err);
          }
        });
      } else {
        this.authService.register(data).subscribe({
          next: () => {
            this.isLogin = true;
            this.error = 'Registro exitoso. Por favor inicie sesión.';
          },
          error: (err) => {
            this.error = 'Error en el registro. El correo podría ya estar en uso.';
            console.error(err);
          }
        });
      }
    }
  }
}

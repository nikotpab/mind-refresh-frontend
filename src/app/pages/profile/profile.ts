import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth';
import { UsersService } from '../../core/services/users.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  
  currentUser$ = this.authService.currentUser$;
  profileForm: FormGroup;
  successMessage: string = '';
  selectedFile: File | null = null;
  photoPreview: string | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }],
      photoUrl: ['']
    });
  }

  ngOnInit() {
    this.usersService.getProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
          photoUrl: user.photoUrl || '/default-avatar.png'
        });
        this.photoPreview = user.photoUrl || '/default-avatar.png';
      },
      error: (err) => console.error('Error loading profile', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
        this.profileForm.patchValue({ photoUrl: e.target.result });
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.usersService.updateProfile(this.profileForm.value).subscribe({
        next: () => {
          this.successMessage = 'Perfil actualizado correctamente.';
          const user = this.authService.getCurrentUser();
          this.authService.updateUser({ 
            ...user, 
            name: this.profileForm.value.name,
            photoUrl: this.profileForm.value.photoUrl 
          });
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => console.error('Error updating profile', err)
      });
    }
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  currentUser$ = this.authService.currentUser$;
  profileForm: FormGroup;

  constructor() {
    const user = this.authService.getCurrentUser();
    this.profileForm = this.fb.group({
      name: [user?.name || '', [Validators.required]],
      email: [{ value: user?.email || '', disabled: true }],
      role: [{ value: user?.role || '', disabled: true }]
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Update profile:', this.profileForm.value);
      // Here you would typically call a service to update the profile
      alert('Profile update functionality coming soon!');
    }
  }
}

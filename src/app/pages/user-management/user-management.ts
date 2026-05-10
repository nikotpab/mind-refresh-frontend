import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  private usersService = inject(UsersService);
  users: any[] = [];
  roles = ['Administrador', 'Líder', 'Colaborador'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error fetching users', err)
    });
  }

  changeRole(user: any, newRole: string) {
    if (confirm(`¿Está seguro de cambiar el rol de ${user.name} a ${newRole}?`)) {
      this.usersService.updateRole(user.id, newRole).subscribe({
        next: () => {
          user.role = newRole;
          alert('Rol actualizado con éxito');
        },
        error: (err) => console.error('Error updating role', err)
      });
    }
  }

  transferLeadership(user: any) {
    if (confirm(`¿Desea activar la sucesión de liderazgo a ${user.name}? Esto le otorgará permisos de Administrador.`)) {
      this.usersService.updateRole(user.id, 'Administrador').subscribe({
        next: () => {
          user.role = 'Administrador';
          alert('Sucesión de liderazgo activada con éxito');
        },
        error: (err) => console.error('Error in leadership succession', err)
      });
    }
  }
}

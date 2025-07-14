import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  auth: AuthService;

  constructor() {
    this.auth = inject(AuthService);
  }

  onSubmit() {
    if (!this.email.trim() || !this.password || this.password !== this.confirmPassword) return;
    this.auth.register(this.email, this.password);
  }
}

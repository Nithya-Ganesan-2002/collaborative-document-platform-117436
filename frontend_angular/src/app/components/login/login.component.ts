import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  auth: AuthService;

  constructor() {
    this.auth = inject(AuthService);
  }

  onSubmit() {
    if (!this.email.trim() || !this.password) return;
    this.auth.login(this.email, this.password);
  }
}

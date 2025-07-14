import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

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

  // @ts-ignore auth is only used in template; suppress linter error
  constructor(public auth: AuthService) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.auth.error.set('Passwords do not match.');
      return;
    }
    this.auth.register(this.email, this.password);
  }
}

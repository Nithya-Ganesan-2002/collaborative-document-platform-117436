import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-document-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-create.component.html',
  styleUrl: './document-create.component.css'
})
export class DocumentCreateComponent {
  title = '';
  content = '';
  errorMsg: string|null = null;
  submitting = false;

  onSubmit() {
    if (!this.title.trim()) return;
    this.submitting = true;
    // The logic must use Observable for navigation and error
  }
}

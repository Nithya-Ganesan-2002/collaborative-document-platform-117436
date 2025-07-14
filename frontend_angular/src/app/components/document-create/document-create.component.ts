import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { DocumentService } from "../../services/document.service";

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
}

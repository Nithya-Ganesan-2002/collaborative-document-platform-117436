import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DocumentDetail } from '../../services/document.service';

@Component({
  selector: 'app-document-collaborators',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-collaborators.component.html',
  styleUrl: './document-collaborators.component.css'
})
export class DocumentCollaboratorsComponent {
  @Input() document!: DocumentDetail;
  @Input() editable: boolean = false;
  @Output() invite = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  pendingInvite = '';

  onInvite() {
    if (this.pendingInvite.trim()) {
      this.invite.emit(this.pendingInvite.trim());
      this.pendingInvite = '';
    }
  }
}

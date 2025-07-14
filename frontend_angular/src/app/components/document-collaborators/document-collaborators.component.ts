import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DocumentDetail } from '../../services/document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-collaborators',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-collaborators.component.html',
  styleUrl: './document-collaborators.component.css'
})
export class DocumentCollaboratorsComponent implements OnInit, OnDestroy {
  @Input() document!: DocumentDetail;
  @Input() editable: boolean = false;
  @Output() invite = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  pendingInvite = '';
  onlineCollaborators: string[] = [];

  private onlineSub?: Subscription;

  ngOnInit(): void {
    // Leave only if actual runtime collab service connection implemented
  }

  ngOnDestroy(): void {
    if (this.onlineSub) this.onlineSub.unsubscribe();
  }

  onInvite() {
    if (this.pendingInvite.trim()) {
      this.invite.emit(this.pendingInvite.trim());
      this.pendingInvite = '';
    }
  }
}

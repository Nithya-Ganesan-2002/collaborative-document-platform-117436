import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DocumentDetail } from '../../services/document.service';
import { CollabMsg, CollabService } from '../../services/collab.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-document-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-editor.component.html',
  styleUrl: './document-editor.component.css'
})
export class DocumentEditorComponent implements OnInit, OnDestroy {
  @Input() document!: DocumentDetail;
  @Input() editable: boolean = false;
  @Output() save = new EventEmitter<DocumentDetail>();

  editTitle!: string;
  editContent!: string;

  collab: CollabService;
  auth: AuthService;

  private collabSub?: Subscription;
  private selfChange: boolean = false;

  constructor() {
    // Use Angular inject for standalone component DI
    this.collab = inject(CollabService);
    this.auth = inject(AuthService);
  }

  ngOnInit() {
    this.editTitle = this.document?.title || '';
    this.editContent = this.document?.content || '';

    // Connect WebSocket if collaborating
    if (this.editable && this.document.id && this.auth.user()?.email) {
      this.collabSub = this.collab.connect(this.document.id, this.auth.user()!.email!)
        .subscribe((msg: CollabMsg) => this.onCollabMsg(msg));
    }
  }

  ngOnDestroy() {
    if (this.collabSub) this.collabSub.unsubscribe();
    this.collab.disconnect();
  }

  onSave() {
    this.save.emit({
      ...this.document,
      title: this.editTitle,
      content: this.editContent
    });
    // Send latest edit over WS
    if (this.editable && this.document.id && this.auth.user()?.email) {
      this.selfChange = true;
      this.collab.sendEdit(this.editContent, this.editTitle);
    }
  }

  onCollabMsg(msg: CollabMsg) {
    if (msg.type === 'edit' && msg.user !== this.auth.user()?.email) {
      this.selfChange = true; // to avoid feedback loop
      if (msg.content !== this.editContent) this.editContent = msg.content;
      if (msg.title !== undefined && msg.title !== this.editTitle) this.editTitle = msg.title ?? '';
    }
  }

  // For live sync as user types (optional)
  onContentChange() {
    if (this.editable && !this.selfChange && this.document.id && this.auth.user()?.email) {
      this.collab.sendEdit(this.editContent, this.editTitle);
    }
    this.selfChange = false;
  }

  onTitleChange() {
    this.onContentChange();
  }
}

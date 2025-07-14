import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from "@angular/common";
import { DocumentDetail, DocumentService } from "../../services/document.service";
import { DocumentEditorComponent } from '../document-editor/document-editor.component';
import { DocumentCollaboratorsComponent } from '../document-collaborators/document-collaborators.component';

@Component({
  selector: 'app-document-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DocumentEditorComponent,
    DocumentCollaboratorsComponent
  ],
  templateUrl: './document-view.component.html',
  styleUrl: './document-view.component.css'
})
export class DocumentViewComponent implements OnInit {
  docId!: string;
  doc: DocumentDetail | null = null;
  loading = true;
  editMode = false;
  errorMsg: string | null = null;

  docs: DocumentService;
  route: ActivatedRoute;
  router: Router;

  constructor() {
    this.docs = inject(DocumentService);
    this.route = inject(ActivatedRoute);
    this.router = inject(Router);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.docId = params['id'];
      if (this.docId) {
        this.loadDoc(this.docId);
      }
      this.editMode = this.router.url.endsWith('edit');
    });
  }

  loadDoc(id: string) {
    this.loading = true;
    this.errorMsg = null;
    this.docs.getDocument(id).subscribe({
      next: (doc) => {
        this.doc = doc;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Could not load document.';
        this.loading = false;
      }
    });
  }

  onSave(newDoc: DocumentDetail) {
    if (!this.doc) return;
    this.docs.updateDocument(this.doc.id, { title: newDoc.title, content: newDoc.content }).subscribe({
      next: doc => {
        this.doc = doc;
        this.editMode = false;
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Failed to save changes.';
      }
    });
  }

  onInvite(invitee: string) {
    if (!this.doc) return;
    this.docs.inviteCollaborator(this.doc.id, invitee).subscribe({
      next: () => {},
      error: err => {
        this.errorMsg = err.error?.message || 'Invitation failed.';
      }
    });
  }

  onRemove(collaborator: string) {
    if (!this.doc) return;
    this.docs.removeCollaborator(this.doc.id, collaborator).subscribe({
      next: () => {
        // Optimistically update UI after remove (optionally reload doc)
        if (this.doc)
          this.doc.collaborators = (this.doc.collaborators || []).filter(c => c !== collaborator);
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Remove collaborator failed.';
      }
    });
  }
}

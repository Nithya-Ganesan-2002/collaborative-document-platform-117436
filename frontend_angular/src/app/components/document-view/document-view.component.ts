import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from "@angular/common";
import { DocumentService, DocumentDetail } from "../../services/document.service";
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

export class DocumentViewComponent implements OnInit {
  docId!: string;
  doc: DocumentDetail | null = null;
  loading = true;
  editMode = false;
  errorMsg: string | null = null;

  ngOnInit() {}
}

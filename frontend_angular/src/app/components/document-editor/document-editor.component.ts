import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DocumentDetail } from '../../services/document.service';

@Component({
  selector: 'app-document-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-editor.component.html',
  styleUrl: './document-editor.component.css'
})
export class DocumentEditorComponent implements OnInit {
  @Input() document!: DocumentDetail;
  @Input() editable: boolean = false;
  @Output() save = new EventEmitter<DocumentDetail>();

  editTitle!: string;
  editContent!: string;

  ngOnInit() {
    this.editTitle = this.document?.title || '';
    this.editContent = this.document?.content || '';
  }

  onSave() {
    this.save.emit({
      ...this.document,
      title: this.editTitle,
      content: this.editContent
    });
  }
}

import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
export { CollabService } from './collab.service';

export interface DocumentBrief {
  id: string;
  title: string;
  owner: string;
  collaborators?: string[];
}
export interface DocumentDetail extends DocumentBrief {
  content: string;
}

export interface UserBrief {
  id: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  public documents = signal<DocumentBrief[]>([]);
  public loading = signal<boolean>(false);
  public error = signal<string|null>(null);

  private apiUrl = '/api';
  constructor(private http: HttpClient) {}

  private getToken(): string|null {
    return typeof globalThis !== 'undefined' && globalThis.localStorage
      ? globalThis.localStorage.getItem('auth_token')
      : null;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders(token ? { 'Authorization': 'Bearer ' + token } : {});
  }

  // PUBLIC_INTERFACE
  listDocuments() {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<DocumentBrief[]>(`${this.apiUrl}/documents`, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (docs: DocumentBrief[]) => {
        this.documents.set(docs);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(err.error?.message || 'Could not fetch documents.');
        this.loading.set(false);
      }
    });
  }

  // PUBLIC_INTERFACE
  getDocument(id: string) {
    return this.http.get<DocumentDetail>(`${this.apiUrl}/documents/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PUBLIC_INTERFACE
  createDocument(data: { title: string; content: string; }) {
    return this.http.post<DocumentDetail>(`${this.apiUrl}/documents`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // PUBLIC_INTERFACE
  updateDocument(id: string, data: { title?: string; content?: string; }) {
    return this.http.patch<DocumentDetail>(`${this.apiUrl}/documents/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // PUBLIC_INTERFACE
  deleteDocument(id: string) {
    return this.http.delete(`${this.apiUrl}/documents/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // PUBLIC_INTERFACE
  inviteCollaborator(id: string, inviteeId: string) {
    return this.http.post(`${this.apiUrl}/documents/${id}/invite`, { inviteeId }, {
      headers: this.getAuthHeaders()
    });
  }

  // PUBLIC_INTERFACE
  removeCollaborator(id: string, collaboratorId: string) {
    return this.http.post(`${this.apiUrl}/documents/${id}/remove-collaborator`, { collaboratorId }, {
      headers: this.getAuthHeaders()
    });
  }

  // PUBLIC_INTERFACE
  syncContent(id: string, content: string) {
    return this.http.post(`${this.apiUrl}/documents/${id}/sync`, { content }, {
      headers: this.getAuthHeaders()
    });
  }
}

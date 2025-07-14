import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

// Types for messages
export interface CollabDocEditMsg {
  type: 'edit';
  content: string;
  title?: string;
  user: string;
}
export interface CollabPresenceMsg {
  type: 'presence';
  online: string[];
  user: string;
}
export type CollabMsg = CollabDocEditMsg | CollabPresenceMsg;

@Injectable({
  providedIn: 'root'
})
export class CollabService {
  private ws?: WebSocket;
  private docId?: string;
  private userEmail?: string;
  private lastContent: string = '';
  private lastTitle: string = '';

  private incoming$ = new Subject<CollabMsg>();
  private online$ = new BehaviorSubject<string[]>([]);

  connect(documentId: string, userEmail: string): Observable<CollabMsg> {
    this.disconnect();
    this.docId = documentId;
    this.userEmail = userEmail;

    // You may tune WS URL as per backend; here assumed at /ws/collab/{docId}
    // Check window object for SSR-safe code
    if (typeof globalThis === 'undefined' || !('location' in globalThis)) {
      return this.incoming$.asObservable(); // SSR: no WebSocket
    }
    const wsProtocol = globalThis.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${globalThis.location.host}/ws/collab/${encodeURIComponent(documentId)}?user=${encodeURIComponent(userEmail)}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      // Announce presence
      this.sendPresence();
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as CollabMsg;
        this.incoming$.next(msg);

        if (msg.type === 'presence' && Array.isArray(msg.online)) {
          this.online$.next(msg.online);
        }
      } catch {
        // ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      this.online$.next([]);
    };

    return this.incoming$.asObservable();
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = undefined;
    this.docId = undefined;
    this.userEmail = undefined;
    this.incoming$ = new Subject<CollabMsg>();
    this.online$ = new BehaviorSubject<string[]>([]);
  }

  sendEdit(content: string, title?: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.userEmail) {
      if (content !== this.lastContent || title !== this.lastTitle) {
        this.lastContent = content;
        this.lastTitle = title || '';
        this.ws.send(JSON.stringify({
          type: 'edit', content, title, user: this.userEmail
        }));
      }
    }
  }

  sendPresence() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.userEmail) {
      this.ws.send(JSON.stringify({
        type: 'presence', user: this.userEmail
      }));
    }
  }

  getOnline$(): Observable<string[]> {
    return this.online$.asObservable();
  }
}

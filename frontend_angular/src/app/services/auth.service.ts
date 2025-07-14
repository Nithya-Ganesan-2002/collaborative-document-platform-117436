import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface UserProfile {
  email: string;
}

/**
 * Returns true if running in the browser, false on SSR.
 */
function isBrowser(): boolean {
  return typeof globalThis !== 'undefined' && typeof globalThis.localStorage !== 'undefined';
}
function getLocalStorage(): Storage | null {
  return isBrowser() ? globalThis.localStorage : null;
}
function doAtob(input: string): string | null {
  if (isBrowser() && typeof globalThis.atob === 'function') {
    return globalThis.atob(input);
  }
  return null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user = signal<UserProfile|null>(null);
  public loading = signal<boolean>(false);
  public error = signal<string|null>(null);

  private tokenKey = 'auth_token';
  private apiUrl = '/api';

  constructor(private http: HttpClient) {
    if (isBrowser()) {
      const token = this.getToken();
      if (token) {
        this.setToken(token);
        this.fetchProfile();
      }
    }
  }

  // PUBLIC_INTERFACE
  login(email: string, password: string) {
    this.loading.set(true);
    this.error.set(null);
    this.http.post<{token: string}>(`${this.apiUrl}/auth/login`, { email, password }).subscribe({
      next: (res) => {
        this.setToken(res.token);
        this.fetchProfile();
        this.loading.set(false);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Login failed.');
        this.loading.set(false);
      }
    });
  }

  // PUBLIC_INTERFACE
  register(email: string, password: string) {
    this.loading.set(true);
    this.error.set(null);
    this.http.post(`${this.apiUrl}/auth/register`, { email, password }).subscribe({
      next: () => {
        this.login(email, password);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed.');
        this.loading.set(false);
      }
    });
  }

  // PUBLIC_INTERFACE
  logout() {
    const token = this.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': 'Bearer ' + token }) : undefined;
    this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers }).subscribe({
      next: () => {
        this.clearToken();
        this.user.set(null);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.clearToken();
        this.user.set(null);
        this.router.navigate(['/login']);
      }
    });
  }

  // PUBLIC_INTERFACE
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.user();
  }

  // PUBLIC_INTERFACE
  fetchProfile() {
    const token = this.getToken();
    if (!token) {
      this.user.set(null);
      return;
    }
    try {
      const payloadB64 = token.split('.')[1];
      const decoded = doAtob(payloadB64 || '');
      if (!decoded) { this.user.set(null); return; }
      const payload = JSON.parse(decoded);
      this.user.set({ email: payload.email });
    } catch {
      this.user.set(null);
    }
  }

  private setToken(token: string) {
    const ls = getLocalStorage();
    if (ls) ls.setItem(this.tokenKey, token);
  }
  private getToken(): string|null {
    const ls = getLocalStorage();
    return ls ? ls.getItem(this.tokenKey) : null;
  }
  private clearToken() {
    const ls = getLocalStorage();
    if (ls) ls.removeItem(this.tokenKey);
  }
}

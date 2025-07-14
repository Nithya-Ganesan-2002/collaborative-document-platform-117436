import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';

import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentViewComponent } from './components/document-view/document-view.component';
import { DocumentCreateComponent } from './components/document-create/document-create.component';

export const routes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  // Document routes
  { path: 'documents', component: DocumentListComponent, canActivate: [authGuard] },
  { path: 'documents/new', component: DocumentCreateComponent, canActivate: [authGuard] },
  { path: 'documents/:id', component: DocumentViewComponent, canActivate: [authGuard] },
  { path: 'documents/:id/edit', component: DocumentViewComponent, canActivate: [authGuard] }
];

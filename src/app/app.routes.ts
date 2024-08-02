import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthorizedComponent } from './pages/errors/not_authorized/not_authorized.component';
import { adminRoutes } from './pages/admin/admin.routes';
import { IndexComponent } from './pages/admin/index/index.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'admin',
    component: IndexComponent,
    canActivate: [AuthGuard],
    children: adminRoutes,
  },
  {
    path: 'not_authorized',
    component: NotAuthorizedComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

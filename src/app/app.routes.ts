import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { IndexComponent } from './pages/admin/index/index.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'admin', component: LoginComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

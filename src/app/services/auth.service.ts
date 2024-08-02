import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../environments/environments.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  AuthStatus,
  CheckTokenResponse,
  LoginResponse,
  User,
} from '../interfaces';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser: User | null;
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('user')!);
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser = JSON.parse(localStorage.getItem('user')!);

    return true;
  }

  login(email: string, password: string): Observable<User> {
    const url = `${this.baseUrl}/users/logins`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => {
        this.setAuthentication(user, token);
        if (user.profile === 'admin') {
          Swal.fire(
            'Inicio de sesión',
            `Sea bienvenid@ administrador/a ${user.firstname} ${user.lastname}.`,
            'success'
          );
        } else if (user.profile === 'user') {
          Swal.fire(
            'No autorizado',
            `Lo sentimos mucho ${user.firstname} ${user.lastname}, en esta página no tienes acceso a ninguna sección.`,
            'error'
          );
        }
        return user;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  checkAuthStatus(): Observable<boolean | void> {
    const url = `${this.baseUrl}/users/checks`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<CheckTokenResponse>(url, null, { headers }).pipe(
      map(({ token, user }) => {
        this.setAuthentication(user, token);
      }),
      catchError((e) => {
        this.logout();
        this.router.navigateByUrl('/');
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  logout() {
    console.log('Logout');
    localStorage.removeItem('token');
    this._authStatus.set(AuthStatus.notAuthenticated);
    localStorage.removeItem('user');
    this.currentUser = null;
  }
}

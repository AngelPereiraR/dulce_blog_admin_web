import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../environments/environments.prod';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Category, Subcategory } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);

  private _currentPage = signal<string | null>(null);
  public currentPage = computed(() => this._currentPage());

  setPage(page: string) {
    this._currentPage.set(page);
  }

  getCategories(): Observable<Category[]> {
    const url = `${this.baseUrl}/categories`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Category[]>(url, { headers }).pipe(
      map((teams) => {
        return teams;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  getCategory(id: string): Observable<Category> {
    const url = `${this.baseUrl}/categories/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Category>(url, { headers }).pipe(
      map((team) => {
        return team;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  addCategory(
    name: string,
    slug: string | null,
    subcategories: Subcategory[],
    enabled: boolean | null
  ) {
    const url = `${this.baseUrl}/categories`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let body;

    if (!slug && enabled) {
      body = { name, enabled, subcategories };
    } else if (!enabled && slug) {
      body = { name, slug, subcategories };
    } else if (!enabled && !slug) {
      body = { name, subcategories };
    } else {
      body = { name, slug, enabled, subcategories };
    }

    return this.http.post<Category>(url, body, { headers }).pipe(
      map((team) => {
        return team;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  updateCategory(
    id: string,
    name: string | null,
    slug: string | null,
    subcategories: Subcategory[],
    enabled: boolean | null
  ) {
    const url = `${this.baseUrl}/categories/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let body;

    if (!slug && name && enabled) {
      body = { name, enabled, subcategories };
    } else if (!enabled && name && slug) {
      body = { name, slug, subcategories };
    } else if (enabled && !name && slug) {
      body = { enabled, slug, subcategories };
    } else if (!enabled && !name && slug) {
      body = { slug, subcategories };
    } else if (!enabled && name && !slug) {
      body = { name, subcategories };
    } else if (enabled && !name && !slug) {
      body = { enabled, subcategories };
    } else {
      body = { name, slug, enabled, subcategories };
    }

    return this.http
      .put<Category>(url, body, { headers })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  removeCategory(id: string) {
    const url = `${this.baseUrl}/categories/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .delete<Category>(url, { headers })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }
}

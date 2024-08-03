import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../environments/environments.prod';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Subcategory } from '../interfaces/subcategory';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriesService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);

  private _currentPage = signal<string | null>(null);
  public currentPage = computed(() => this._currentPage());

  setPage(page: string) {
    this._currentPage.set(page);
  }

  getSubcategories(): Observable<Subcategory[]> {
    const url = `${this.baseUrl}/subcategories`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Subcategory[]>(url, { headers }).pipe(
      map((teams) => {
        return teams;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  getSubcategory(id: string): Observable<Subcategory> {
    const url = `${this.baseUrl}/subcategories/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Subcategory>(url, { headers }).pipe(
      map((team) => {
        return team;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  addSubcategory(name: string, slug: string | null, enabled: boolean | null) {
    const url = `${this.baseUrl}/subcategories`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let body;

    if (!slug && enabled) {
      body = { name, enabled };
    } else if (!enabled && slug) {
      body = { name, slug };
    } else if (!enabled && !slug) {
      body = { name };
    } else {
      body = { name, slug, enabled };
    }

    return this.http.post<Subcategory>(url, body, { headers }).pipe(
      map((team) => {
        return team;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  updateSubcategory(
    id: string,
    name: string | null,
    slug: string | null,
    enabled: boolean | null
  ) {
    const url = `${this.baseUrl}/subcategories/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let body;

    if (!slug && name && enabled) {
      body = { name, enabled };
    } else if (!enabled && name && slug) {
      body = { name, slug };
    } else if (enabled && !name && slug) {
      body = { enabled, slug };
    } else if (!enabled && !name && slug) {
      body = { slug };
    } else if (!enabled && name && !slug) {
      body = { name };
    } else if (enabled && !name && !slug) {
      body = { enabled };
    } else {
      body = { name, slug, enabled };
    }

    return this.http
      .put<Subcategory>(url, body, { headers })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  removeSubcategory(id: string) {
    const url = `${this.baseUrl}/subcategories/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .delete<Subcategory>(url, { headers })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }
}

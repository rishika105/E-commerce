import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { environment } from '../../../environment';
import { map, first, switchMap, tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface Category {
name: any;
  id: number;
  categoryName: string;
  description: string;
}


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/category`;

  constructor(
    private http: HttpClient,
    private store: Store<any>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthToken(): Observable<string> {
    return this.store.select('auth').pipe(
      first(),
      map((authData) => {
        const token = authData?.token || (isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null) || '';
        console.log('Token from store/localStorage:', token);
        return token;
      })
    );
  }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof Error) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.error || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getCategories(): Observable<Category[]> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = this.getHeaders(token);
        return this.http.get<Category[]>(`${this.apiUrl}/getCategories`, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Get categories response:', response)),
            catchError(this.handleError)
          );
      })
    );
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    if (!category.categoryName || category.categoryName.trim() === '') {
      return throwError(() => new Error('Category name cannot be empty'));
    }
    if (!category.description || category.description.trim() === '') {
      return throwError(() => new Error('Category description cannot be empty'));
    }

    const trimmedCategory = {
      ...category,
      categoryName: category.categoryName.trim(),
      description: category.description.trim()
    };

    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = this.getHeaders(token);
        return this.http.post<Category>(`${this.apiUrl}/createCategory`, trimmedCategory, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Create category response:', response)),
            catchError(this.handleError)
          );
      })
    );
  }

  updateCategory(category: Category): Observable<Category> {
    if (!category.categoryName || category.categoryName.trim() === '') {
      return throwError(() => new Error('Category name cannot be empty'));
    }
    if (!category.description || category.description.trim() === '') {
      return throwError(() => new Error('Category description cannot be empty'));
    }

    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = this.getHeaders(token);
        return this.http.put<Category>(`${this.apiUrl}/updateCategory/${category.id}`, category, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Update category response:', response)),
            catchError(this.handleError)
          );
      })
    );
  }

  deleteCategory(id: number): Observable<any> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = this.getHeaders(token);
        return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Delete category response:', response)),
            catchError(this.handleError)
          );
      })
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = this.getHeaders(token);
        return this.http.get<Category>(`${this.apiUrl}/getCategorybyId/${id}`, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Get category by ID response')),
            catchError(this.handleError)
          );
      })
    );
  }
}

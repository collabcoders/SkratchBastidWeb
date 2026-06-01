import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Config } from '@shared/config';
import { environment } from '@env/environment';

/**
 * Shared foundation for all LegendsOnly API calls.
 *
 * - Prefixes every request with environment.legendsApi.
 * - Sends the tenant once via the `X-App` header (Config.app), so individual
 *   endpoints no longer carry ?app=/&appId= on the query string.
 * - The existing HTTP interceptor still attaches the Authorization token.
 *
 * As MixApps endpoints are migrated, their LegendsOnly services build on this.
 */
@Injectable({
  providedIn: 'root'
})
export class LegendsApiService {
  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    return new HttpHeaders().set('X-App', Config.app);
  }

  private url(path: string): string {
    const trimmed = path.startsWith('/') ? path.slice(1) : path;
    return `${environment.legendsApi}/${trimmed}`;
  }

  get<T = any>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.url(path), { headers: this.headers(), params }).pipe(
      retry(3),
      catchError((err) => throwError(() => err))
    );
  }

  post<T = any>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.url(path), body, { headers: this.headers() }).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  put<T = any>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.url(path), body, { headers: this.headers() }).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  delete<T = any>(path: string, params?: HttpParams): Observable<T> {
    return this.http.delete<T>(this.url(path), { headers: this.headers(), params }).pipe(
      catchError((err) => throwError(() => err))
    );
  }
}

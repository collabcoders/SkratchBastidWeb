import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Config } from '@shared/config';
import { UtilitiesService } from './utilities.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    private util: UtilitiesService
  ) { }

  private baseUrl(path: string): string {
    let apiBaseUrl = '';
    if (path.toLowerCase().startsWith('http')) {
      apiBaseUrl = path;
    } else {
      if (!path.startsWith("/")) {
        path = "App/" + path;
      }
      apiBaseUrl = environment.api + '/api/' + path;
      if (path.toLowerCase().indexOf('http') != -1) {
        apiBaseUrl = path;
      }
    }
    return apiBaseUrl;
  }

  setHeader(skipInterceptor: boolean, skipAuth: boolean): HttpHeaders {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    if (skipInterceptor) {
      header = header.append(Config.interceptorSkipHeader, '');
    }
    if (skipAuth) {
      header = header.append(Config.noAuthHeader, '');
    }
    return header;
  }

  public postAsForm (path: string, body: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<any>(`${this.baseUrl(path)}`, body, {headers: headers});
  }

  public get(path: string, skipInterceptor = true, skipAuth = true) {
    console.log(this.baseUrl(path));
    return this.http.get<any>(`${this.baseUrl(path)}`, { headers: this.setHeader(skipInterceptor, skipAuth) });
  }

  public patch(path: string, body: any, skipInterceptor = true, skipAuth = true): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl(path)}`, JSON.stringify(body), { headers: this.setHeader(skipInterceptor, skipAuth) });
  }

  public put<T = any>(path: string, body: T, skipInterceptor = true, skipAuth = true) {
    return this.http.put<any>(`${this.baseUrl(path)}`, JSON.stringify(body), { headers: this.setHeader(skipInterceptor, skipAuth) });
  }

  public post<T = any>(path: string, body: T, skipInterceptor = true, skipAuth = true) {
    return this.http.post<any>(`${this.baseUrl(path)}`, JSON.stringify(body), { headers: this.setHeader(skipInterceptor, skipAuth) });
  }

  public delete(path: string, skipInterceptor = true, skipAuth = true) {
    return this.http.delete<any>(`${this.baseUrl(path)}`, { headers: this.setHeader(skipInterceptor, skipAuth) });
  }

  private endPoint(path: string): string {
    let endpointSection = path.charAt(0).toUpperCase() + path.slice(1);
    if (path.toLocaleLowerCase().indexOf('http') != -1) {
      endpointSection = '';
    }
    return endpointSection;
  }

  private checkForError(err: HttpErrorResponse): any {
    let message = '';
    console.log("checkForError", err);
    if (err.statusText != null || err.statusText !== '') {
      message = err.statusText;
    }
    if (err.error != null) {
      try {
        message = err.error.message;
      } catch (err) {
      }
    }
    if (message == null || message === '') {
      message = 'An error occurred while processing your request.';
    }
    // manually handle certain errors
    if (err.status === 401 || err.status === 200) {
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        // do nothing
      } else {
        message = 'Your session has timed out.  You will not be redirected to the Sign In page.';
      }
    }

    // bootbox.alert(message, () => {
    //   window.location.href = '/home';
    // });

    if (err?.error?.Message) {
      try {
        message = err.error.Message;
        const error = new Error();
        error.message = message;
        console.log("error here", error);
        return throwError(() => error);
      } catch (err) {
      }
    }

    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      return throwError(() => err.error);
    } else {
      const error = new Error(message);
      error.message = message;
      console.log("error here 2", error);
      // return error;
      return throwError(() => error);
    }
  }

  public getData(section: string, category: string, queryString: string, app?: string): Observable<any> {
    if (!this.util.isEmptyOrNull(category)) {
      queryString += ((section.toLocaleLowerCase() === 'categories') ? '&section=' : '&category=') + category;
    }
    let uri = '';
    if (app) {
      uri = this.baseUrl(section) + '?app=' + app + queryString;
    } else {
      uri = this.baseUrl(section) + '?app=' + Config.app + queryString;
    }
    //const uri = this.baseUrl(section) + this.endPoint(section) + '?app=' + Config.app + queryString;
    console.log(uri);
    return this.http.get<any>(uri, { headers: this.setHeader(false, false) })
    .pipe(
      retry(3),
      catchError(this.checkForError)
    );
  }

  public getItem(section: string, id: number, additionalParams = '',skipInterceptor = true): Observable<any> {
    if (section.toLocaleLowerCase() == 'user') {
      return this.http.get(this.baseUrl('') + 'GetUser?appId=' + Config.app, { headers: this.setHeader(skipInterceptor, skipInterceptor) })
        .pipe(
        retry(3),
        catchError(this.checkForError)
      );
    } else if (section.toLocaleLowerCase() == 'member' || section.toLocaleLowerCase() == 'profile' || section.toLocaleLowerCase() == 'subscription') {
      return this.http.get(this.baseUrl('') + 'GetMember?appId=' + Config.app + '&section=' + section, { headers: this.setHeader(skipInterceptor, skipInterceptor) })
        .pipe(
        retry(3),
        catchError(this.checkForError)
      );
    } else if (section.toLocaleLowerCase() == 'cancel') {
      return this.http.get(this.baseUrl('') + 'CancelSubscription?app=' + Config.app, { headers: this.setHeader(skipInterceptor, skipInterceptor) })
        .pipe(
        retry(3),
        catchError(this.checkForError)
      );
    } else if (section.toLocaleLowerCase() == 'favorite') {
      return this.http.get(this.baseUrl('') + 'CheckFavorite?app=' + Config.app + additionalParams, { headers: this.setHeader(skipInterceptor, skipInterceptor) })
        .pipe(
        retry(3),
        catchError(this.checkForError)
      );
    } else {
      return this.http.get(this.baseUrl('') + 'GetRecord/' + id + '?app=' + Config.app + '&section=' + section)
      .pipe(
        retry(3),
        catchError(this.checkForError)
      );
    }
  }

  public getText(filename: string) {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'text/plain; charset=utf-8');
    header = header.append(Config.interceptorSkipHeader, '');
    return this.http.get(Config.content + filename, { responseType: 'text', headers: header });
  }

  public log(section: string, id: number) {
    this.http.get(this.baseUrl(section) + 'Log/' + id + '?app=' + Config.app + '&section=' + section)
      .pipe(
        retry(3),
        catchError(this.checkForError)
      ).subscribe(result => {
        let jsonObject = JSON.parse(JSON.stringify(result));
        console.log(jsonObject.data);
      });
  }

    /**
     * Get section data (featuredVideosSection, topGrillinSection, mixesSection)
     * If environment.isDummy, loads from /json/{section}.json in public folder.
     * Otherwise, uses API endpoint (customize as needed).
     * Returns Observable<any>.
     */
    public getSectionData(section: string): Observable<any> {
      if ((environment.ismock)) {
        // Load from public/json/{section}.json
        const url = `/json/${section}.json`;
        return this.http.get<any>(url).pipe(
          retry(2),
          catchError(this.checkForError)
        );
      } else {
        // Example: use API endpoint (customize as needed)
        // You can adjust this to match your backend API for sections
        const url = this.baseUrl(section) + '?app=' + Config.app;
        return this.http.get<any>(url, { headers: this.setHeader(false, false) }).pipe(
          retry(3),
          catchError(this.checkForError)
        );
      }
    }
  
}


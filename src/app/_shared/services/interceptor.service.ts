import { Injectable } from '@angular/core';
import { HttpRequest, HttpErrorResponse, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { map, retry, catchError } from 'rxjs/operators';
import { UtilitiesService } from './utilities.service';
import { Config } from '@shared/config';
import { Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(public token: TokenService, public util: UtilitiesService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let updatedRequest: HttpRequest<any>;
    if (req.headers.has(Config.interceptorSkipHeader)) {
      console.log('skip interceptor');
      req = req.clone({ headers: req.headers.delete('X-Skip-Interceptor','') });
      //updatedRequest = req;
      updatedRequest = req.clone({
        setHeaders: {},
        url: req.url
      });
    } else {
      if (req.headers.has(Config.noAuthHeader)) {
        console.log('skip authorization');
        updatedRequest = req.clone({
          url: `${environment.api}${req.url}`
        });
      } else {
        console.log('intercepted');
        updatedRequest = req.clone({
          setHeaders: { Authorization: `Bearer ${this.token.getToken()}` },
          url: `${req.url}`
          //url: `${environment.api}${req.url}`
        });
      }
    }

    return next.handle(updatedRequest);
    // return next.handle(updatedRequest)
    //   .pipe(
    //     map((event: HttpResponse<any>) => {
    //       return event;
    //     }),
    //     retry(3),
    //     catchError(err => this.checkForError(err))
    //   );
  }

  checkForError(err: HttpErrorResponse) {
    console.log(err);
    let message = '';
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
        message = 'Your session has timed out.  You will not be redirected to the Sign-In page.';
      }
    }

    this.showApiError(message);

    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', err.error.message);
      return throwError(err.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      const error = new Error(message);
      return throwError(error);
    }
  }

  showApiError(message: string) {
    
  }
}

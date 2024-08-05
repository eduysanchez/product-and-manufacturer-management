import {
  HttpErrorResponse,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, delayWhen, retry } from 'rxjs/operators';
import { SnackBarService, SnackBarType } from '../services/snack-bar.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private snackBarService: SnackBarService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const baseUrl = 'https://desafio-tecnico-frontend.azurewebsites.net';

    const url = req.url.startsWith('http') ? req.url : `${baseUrl}${req.url}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const reqClone = req.clone({
      headers,
      url,
    });

    return next.handle(reqClone).pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => {
          if (error.status === 503) {
            return of(error).pipe(
              delayWhen(() => timer(Math.pow(2, retryCount) * 1000))
            );
          }
          return throwError(() => error);
        },
      }),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const DEFAULT_ERROR_MESSAGE = 'Error en la solicitud.';

    let message = error.message || DEFAULT_ERROR_MESSAGE;

    this.snackBarService.openSnackBar(message, SnackBarType.ERROR);

    return throwError(() => new Error(message));
  }
}

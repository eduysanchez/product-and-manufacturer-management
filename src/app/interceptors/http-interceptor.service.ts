import {
  HttpErrorResponse,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, delayWhen, retry } from 'rxjs/operators';
import { SnackBarService } from '../services/snack-bar.service';

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

    const url = `${baseUrl}${req.url}`;

    const reqClone = req.clone({
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

    this.snackBarService.openSnackBar(message);

    return throwError(() => new Error(message));
  }
}

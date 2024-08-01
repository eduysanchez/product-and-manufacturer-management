import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = 'https://desafio-tecnico-frontend.azurewebsites.net';

  const clonedRequest = req.clone({
    url: `${baseUrl}${req.url}`,
  });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      return throwError(() => error);
    })
  );
};

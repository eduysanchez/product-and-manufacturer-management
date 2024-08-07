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
import { StatusCodes } from 'http-status-codes';

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
          if (error.status === StatusCodes.SERVICE_UNAVAILABLE) {
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

    const errorMessages: { [key: number]: string } = {
      [StatusCodes.NOT_FOUND]: 'Recurso não encontrado.',
      [StatusCodes.INTERNAL_SERVER_ERROR]: 'Erro interno do servidor.',
      [StatusCodes.BAD_REQUEST]: 'Requisição inválida.',
      [StatusCodes.UNAUTHORIZED]: 'Não autorizado.',
      [StatusCodes.FORBIDDEN]: 'Proibido.',
      [StatusCodes.CONFLICT]: 'Conflito.',
      [StatusCodes.UNPROCESSABLE_ENTITY]: 'Entidade não processável.',
      [StatusCodes.SERVICE_UNAVAILABLE]: 'Serviço indisponível.',
      [StatusCodes.GATEWAY_TIMEOUT]: 'Tempo limite da conexão esgotado.',
      [StatusCodes.REQUEST_TIMEOUT]: 'Tempo limite da requisição esgotado.',
      [StatusCodes.TOO_MANY_REQUESTS]: 'Muitas requisições.',
      [StatusCodes.NOT_IMPLEMENTED]: 'Não implementado.',
      [StatusCodes.GONE]: 'Recurso removido.',
      [StatusCodes.LENGTH_REQUIRED]: 'Tamanho requerido.',
      [StatusCodes.PRECONDITION_FAILED]: 'Falha na pré-condição.',
      [StatusCodes.UNSUPPORTED_MEDIA_TYPE]: 'Tipo de mídia não suportado.',
      [StatusCodes.REQUESTED_RANGE_NOT_SATISFIABLE]:
        'Intervalo solicitado não satisfatório.',
      [StatusCodes.EXPECTATION_FAILED]: 'Falha na expectativa.',
      [StatusCodes.MISDIRECTED_REQUEST]: 'Requisição mal direcionada.',
      [StatusCodes.LOCKED]: 'Bloqueado.',
      [StatusCodes.FAILED_DEPENDENCY]: 'Dependência falhou.',
      [StatusCodes.UPGRADE_REQUIRED]: 'Atualização necessária.',
      [StatusCodes.PRECONDITION_REQUIRED]: 'Pré-condição necessária.',
      [StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE]:
        'Campos de cabeçalho da requisição muito grandes.',
      [StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS]:
        'Indisponível por motivos legais.',
      [StatusCodes.BAD_GATEWAY]: 'Gateway incorreto.',
      [StatusCodes.HTTP_VERSION_NOT_SUPPORTED]: 'Versão HTTP não suportada.',
      [StatusCodes.INSUFFICIENT_STORAGE]: 'Armazenamento insuficiente.',
      [StatusCodes.NETWORK_AUTHENTICATION_REQUIRED]:
        'Autenticação de rede necessária.',
    };

    const message =
      errorMessages[error.status] || error.message || DEFAULT_ERROR_MESSAGE;

    this.snackBarService.openSnackBar(message, SnackBarType.ERROR);

    return throwError(() => new Error(message));
  }
}

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      timeout(30000),
      catchError((error: HttpErrorResponse | TimeoutError) => {
        let userMessage = 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.';

        if (error instanceof TimeoutError) {
          userMessage = 'La solicitud ha tardado demasiado. Por favor, comprueba tu conexión e inténtalo de nuevo.';
        } else if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            userMessage = 'No se ha podido conectar con el servidor. Por favor, comprueba tu conexión a internet.';
          } else if (error.status === 400) {
            userMessage = 'La solicitud no es válida. Por favor, revisa los datos e inténtalo de nuevo.';
          } else if (error.status === 401 || error.status === 403) {
            userMessage = 'No tienes permisos para realizar esta acción.';
          } else if (error.status === 404) {
            userMessage = 'El recurso solicitado no se ha encontrado.';
          } else if (error.status >= 500) {
            userMessage = 'Error en el servidor. Por favor, inténtalo de nuevo más tarde.';
          }
        }

        return throwError(() => new HttpErrorResponse({
          error: { message: userMessage },
          status: error instanceof HttpErrorResponse ? error.status : 0,
          statusText: userMessage,
        }));
      })
    );
  }
}

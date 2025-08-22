import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const HttpInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const loadingService = inject(LoadingService);
  const session = JSON.parse(localStorage.getItem('session') ?? '{}');

  loadingService.show();

  if (session.access_token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
  }

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
}

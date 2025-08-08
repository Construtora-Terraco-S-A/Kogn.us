import { 
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest 
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const HttpInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {

  const session = JSON.parse(localStorage.getItem('session') ?? '{}');
  if (session.access_token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
  }
  return next(req);
}

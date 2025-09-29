import { Injectable, OnDestroy, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { apiUrl } from '../../../../env';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnDestroy {
  public isAuthenticatedSignal: WritableSignal<boolean> = signal(
    !!localStorage.getItem('session')
  );

  private readonly baseUrl: string = apiUrl;

  constructor(
    private readonly cookieService: CookieService,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly loadingService: LoadingService
  ) { 
    window.addEventListener('storage', this.syncAuthStatus.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.syncAuthStatus.bind(this));
  }

  private syncAuthStatus(event: StorageEvent): void {
    if (event.key === 'session') {
      this.isAuthenticatedSignal.set(!!event.newValue);
    }
  }

  login(usuario: string, senha: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { usuario, senha }).pipe(
      tap((response: any) => {
        if (typeof localStorage !== 'undefined') { // Verifica se está no navegador
          localStorage.setItem('session', JSON.stringify(response));
          this.cookieService.set('token', encodeURIComponent(response.token), { path: '/' });
          this.isAuthenticatedSignal.set(true); // Atualiza o signal
        }
      }),
      catchError((error) => {
        console.error("Erro no login:", error);
        this.loadingService.toastr("Erro!", error.error.message || "Ocorreu um erro ao fazer login.", "error",);
        // this.loadingService.notify("Erro!", error.error.message || "Ocorreu um erro ao fazer login.", [], "error" )
        return throwError(() => error); // Propaga o erro para quem subscrever, se necessário
      })
    );
  }
  
  logout(): void {
    this.http.post(`${this.baseUrl}/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${decodeURIComponent(this.cookieService.get('token'))}`
      }
    }).subscribe({
      next: () => {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('session');
          this.cookieService.delete('token', '/');
          this.isAuthenticatedSignal.set(false);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error("Erro no logout:", error);
        this.loadingService.toastr("Erro!", error.error.message || "Ocorreu um erro ao fazer logout.", "error");
      }
    });
  }
  
  public getCurrentUser(): any | null {
    const session = localStorage.getItem('session');
    if (session) {
      const parsedSession = JSON.parse(session);
      return parsedSession?.usuario || null;
    }
    return null;
  }

  resendVerificationEmail(email: string): Observable<any> {
    if (!email) {
      const errorMsg = 'E-mail não fornecido.';
      this.loadingService.toastr("Erro!", errorMsg, "error");
      return throwError(() => new Error(errorMsg));
    }

    return this.http.post(`${this.baseUrl}/email/reenviar`, { email }).pipe(
      catchError((error) => {
        console.error("Erro ao reenviar e-mail de verificação:", error);
        this.loadingService.toastr("Erro!", error.error.message || "Ocorreu um erro ao reenviar o e-mail.", "error");
        return throwError(() => error);
      })
    );
  }

  verifyEmail(token: string, email: string): Observable<any> {
    const options = {
      params: { token, email }
    };
    return this.http.get(`${this.baseUrl}/email/verificar`,  options ).pipe(
      tap((response: any) => {
        if (typeof localStorage !== 'undefined') { // Verifica se está no navegador
          localStorage.setItem('session', JSON.stringify(response));
          this.cookieService.set('token', encodeURIComponent(response.token), { path: '/' });
          this.isAuthenticatedSignal.set(true); // Atualiza o signal
        }
      }),
      catchError((error) => {
        console.error("Erro na verificação de e-mail:", error);
        return throwError(() => error); 
      })
    );
  }


}

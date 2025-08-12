import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from "@angular/core";
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { AuthService, LoadingService } from '../../core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    PasswordModule,
    ReactiveFormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  visibleLoginModal: boolean = false;

  constructor(
    private readonly loadingService:  LoadingService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cookieService: CookieService
  ) {}

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    senha: new FormControl('', [Validators.required])
  });

  showLoginModal() {
    this.visibleLoginModal = true;
  }

  hideLoginModal() {
    this.visibleLoginModal = false;
  }

  public login(): any {
    this.loadingService.show();
    this.authService.login(this.loginForm.value.email, this.loginForm.value.senha).subscribe({
      next: (response: any) => {
        localStorage.setItem('session', JSON.stringify(response));
        this.cookieService.set('token', encodeURIComponent(response.access_token), { path: '/' });
        this.hideLoginModal();
        this.loadingService.hide();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
        this.loadingService.notify("Erro!", error.error.message);
        this.loadingService.hide();
      }
    });
  }
}

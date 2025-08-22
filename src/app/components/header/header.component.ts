import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from "@angular/core";
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
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
    ReactiveFormsModule,
    MessageModule,
    ToastModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  visibleLoginModal: boolean = false;
  loginFormSubmitted: boolean = false;

  constructor(
    private readonly loadingService:  LoadingService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cookieService: CookieService
  ) {}

  showLoginModal() {
    this.visibleLoginModal = true;
  }

  hideLoginModal() {
    this.visibleLoginModal = false;
  }

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    senha: new FormControl('', [Validators.required])
  });

  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control.touched || this.loginFormSubmitted);
  }

  onSubmit() {
    // this.loginFormSubmitted = true;
    // if (this.loginForm.valid) {
    //   this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
    //   this.loginForm.reset();
    //   this.loginFormSubmitted = false;
    // }
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
        this.loadingService.hide();
      }
    });
  }
}

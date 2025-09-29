import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService, LoadingService } from '../../core';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessageModule,
    RouterModule
  ]
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public loginFormSubmitted: boolean = false;
  public errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService
  ) {
    this.loginForm = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    // Preenche e-mail se vier do link de verificação
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.loginForm.get('usuario')?.setValue(params['email']);
      }
    });
  }

  onSubmit(): void {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loadingService.show();
    const { usuario, senha } = this.loginForm.value;

    this.authService.login(usuario, senha).subscribe({
      next: () => {
        this.handlePostLogin();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Falha no login. Verifique suas credenciais.';
        this.loadingService.hide();
      }
    });
  }

  private handlePostLogin(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (token && email) {
      this.authService.verifyEmail(token, email).subscribe({
        next: () => {
          this.loadingService.hide();
          this.loadingService.toastr('Sucesso!', 'E-mail verificado com sucesso!', 'success');
          this.router.navigate(['/generate-content']);
        },
        error: (err) => {
          this.loadingService.hide();
          this.loadingService.toastr('Erro!', err.error?.message || 'Não foi possível verificar o e-mail.', 'error');
          this.router.navigate(['/']);
        }
      });
    } else {
      this.loadingService.hide();
      this.router.navigate(['/generate-content']);
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.loginFormSubmitted);
  }
}

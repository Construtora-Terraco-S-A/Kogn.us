import { 
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  Component,
  effect,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { Popover, PopoverModule } from 'primeng/popover';
import { DividerModule } from 'primeng/divider';
import { AuthService, LoadingService } from '../../core';
import { HeaderService } from './header.service';

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
    ToastModule,
    PopoverModule,
    DividerModule
  ],
  providers: [HeaderService],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Header implements OnInit {

  @ViewChild(Popover) op!: Popover;
  visibleLoginModal: boolean = false;
  loginFormSubmitted: boolean = false;
  isLogged: boolean = false;
  me: any = {};
  routerMenu: any = [
    { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/' },
    { label: 'Notas', icon: 'pi pi-fw pi-book', routerLink: '/notas' },
    { label: 'Desempenho', icon: 'pi pi-fw pi-chart-bar', routerLink: '/desempenho' },
    { label: 'Agenda', icon: 'pi pi-fw pi-calendar', routerLink: '/calendario'},
    { label: 'Curriculo', icon: 'pi pi-fw pi-file', routerLink: '/curriculo'},
    { label: 'Correção', icon: 'pi pi-fw pi-pencil', routerLink: '/correcao'},
    { label: 'Configurações', icon: 'pi pi-fw pi-cog', routerLink: '/settings' }
  ];


  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    public headerService: HeaderService,
    public readonly loadingService: LoadingService
  ) {
    effect(() => {
      const isAuthenticated = this.authService.isAuthenticatedSignal();
      this.isLogged = isAuthenticated;
      if (isAuthenticated) {
        this.dados();
      } else {
        this.me = {}; // Limpa os dados do usuário ao fazer logout
      }
    });
  }

  ngOnInit(): void {}

  toggle(event: Event) {
    this.op.toggle(event);
  }

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    senha: new FormControl('', [Validators.required])
  });

  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control.touched || this.loginFormSubmitted);
  }

  onSubmit() {}

  public login(): any {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.senha).subscribe({
      next: () => {
        this.visibleLoginModal = false;
        this.router.navigate(['/generate-content'])
      }
    });
  }

  public forgotPassword(): any {
    this.headerService.forgotPassword(this.loginForm.value.email).subscribe({
      next: (res: any) => {
        this.loadingService.toastr('Sucesso!', res.message, 'success');
      },
      error: (err) => {
        console.log(err);
        this.loadingService.toastr('Erro!', err.message, 'error');
      },
      complete: () => {}
    });
  }

  public logout(): any {
    this.authService.logout();
    this.op.toggle(event);
  }

  public dados(): any {
    const session = JSON.parse(localStorage.getItem('session') ?? '{}');
    const user = session?.usuario || {};
    return this.me = user;
  }

}
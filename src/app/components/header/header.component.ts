import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { Popover, PopoverModule } from 'primeng/popover';
import { DividerModule } from 'primeng/divider';
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
    ToastModule,
    PopoverModule,
    DividerModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Header implements OnInit {

  @ViewChild(Popover) op!: Popover;
  visibleLoginModal: boolean = false;
  visibleMenuPopover: boolean = false;
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
    { label: 'Configurações', icon: 'pi pi-fw pi-cog', routerLink: '/configuracoes' }
  ];


  constructor(
    private readonly loadingService:  LoadingService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cookieService: CookieService
  ) {}

  toggle(event: Event) {
    this.op.toggle(event);
  }

  ngOnInit(): void {
    this.isLogged = this.loggedIn();
    if(this.isLogged){
      this.dados();
    }
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
        this.visibleLoginModal = false;
        this.loadingService.hide();
        this.router.navigate(['/']);
        this.loggedIn();
      },
      error: (error) => {
        console.error(error);
        this.loadingService.hide();
      }
    });
  }

  private loggedIn(): any {
    this.loadingService.show();
    if (this.cookieService.get('token')) {
      this.loadingService.hide();
      return this.loggedIn;
    } else {
      this.loadingService.hide();
      return this.loggedIn;
    }
  }

  public logout(): any {
    this.loadingService.show();
    localStorage.removeItem('session');
    this.cookieService.delete('token');
    this.loadingService.hide();
    this.router.navigate(['/']);
    this.loggedIn();
    // this.authService.logout().subscribe({
    //   next: (response: any) => {
    //     localStorage.removeItem('session');
    //     this.cookieService.delete('token');
    //     this.loadingService.hide();
    //     this.router.navigate(['/']);
    //     this.loggedIn();
    //   },
    //   error: (error) => {},
    //   complete: () => {
    //     this.loadingService.hide();
    //   }
    // });
  }

  public dados(): any {
    const session = JSON.parse(localStorage.getItem('session') ?? '{}');
    const user = session?.usuario || {};
    return this.me = user;
  }

}

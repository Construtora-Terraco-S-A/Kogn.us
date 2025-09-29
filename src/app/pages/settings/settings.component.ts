import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { 
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { SettingsService } from './settings.service';
import { AuthService, LoadingService } from '../../core';

@Component({
  selector: 'app-settings',
  imports: [
    TabsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SettingsService],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  encapsulation: ViewEncapsulation.None
})
export class Settings implements OnInit{

  tab: number = 0;
  me: any = {};
  alterPassword: boolean = false;
  senhaVisivel: boolean = false;
  confirmacaoSenhaVisivel: boolean = false;
  public userForm: FormGroup;

  constructor(
    private settingsService: SettingsService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {
    this.userForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      nome_usuario: new FormControl('', [Validators.required]),
      senha_atual: new FormControl('', [Validators.required]),
      nova_senha: new FormControl('', [Validators.required]),
      nova_senha_confirmation: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.dados();
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return; 
    }
  }

  saveNewPassword() {
    if (this.userForm.invalid) {
      return; 
    }
    const body = {
      senha_atual: this.userForm.value.senha_atual,
      nova_senha: this.userForm.value.nova_senha,
      nova_senha_confirmation: this.userForm.value.nova_senha_confirmation,
    }

    this.settingsService.atualizarSenha(body).subscribe({
      next: (response: any) => {
        this.loadingService.toastr('Sucesso!', response.message || 'Senha alterada com sucesso!', 'success');
        this.alterPassword = false;
        this.userForm.reset();
      },
      error: (error) => {
        console.error(error);
        this.loadingService.toastr('Erro!', error.error.message, 'error');
      },
      complete: () => {
        this.alterPassword = false;
      }
    });
  }
  

  public dados(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.me = user;
      this.setValueDados();
    }
  }

  public setValueDados(): void {
    this.userForm.patchValue({
      nome: this.me.nome,
      email: this.me.email,
      nome_usuario: this.me.nome_usuario,
    });
  }

  toggleSenhaVisivel() {
    this.senhaVisivel = !this.senhaVisivel;
  }

  toggleConfirmacaoSenhaVisivel() {
    this.confirmacaoSenhaVisivel = !this.confirmacaoSenhaVisivel;
  }
}

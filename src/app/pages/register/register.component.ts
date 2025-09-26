import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RegisterService } from './register.service';
import { LoadingService } from '../../core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';

declare var Stripe: any;

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessageModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
  providers: [RegisterService],
})
export class Register implements OnInit, AfterViewInit {

  public planos: any[] = [];
  public freeplan: boolean = false;
  public choosedPlan: number = 0;
  public selectedPlan: any = null;
  public registerForm: FormGroup;
  public registerFormSubmitted: boolean = false;
  public loadingMessage: string | null = null;

  senhaVisivel: boolean = false;
  confirmacaoSenhaVisivel: boolean = false;

  stripe: any;
  cardElement: any;
  cardErrors: any;

  constructor(
    private registerService: RegisterService,
    private readonly loadingService: LoadingService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      nome_usuario: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required]),
      senha_confirmation: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getListInfoPlanos();
  }

  ngAfterViewInit() {
    this.setupStripe();
  }

  setupStripe() {
    this.stripe = Stripe('pk_test_51S6bwOEbG6HSa2vVD06fYT43kWnNAKsqfID4mAoVFhhpeuMeJS1dmH5VoR6QhxwqcqiobJGOHqFTzpIoL3Fqc9jS00cvZLDgE8');
    const elements = this.stripe.elements();
    const style = {
      base: {
        fontSize: '16px',
        color: '#EFF6FF',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#ef4444',
      }
    };
    this.cardElement = elements.create('card', { style: style });
  }

  mountCard() {
    this.cardElement.mount('#card-element');
    this.cardElement.on('change', (event: any) => {
      this.cardErrors = event.error ? event.error.message : null;
      this.cd.detectChanges();
    });
  }

  choosePlan(planId: number) {
    this.choosedPlan = planId;
    this.selectedPlan = this.planos.find(p => p.id === planId);
    if (this.selectedPlan && +this.selectedPlan.valor_mensal > 0) {
      setTimeout(() => this.mountCard(), 0);
    } else {
      if (this.cardElement) {
        this.cardElement.unmount();
      }
    }
  }

  async onSubmit() {
    this.registerFormSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.loadingMessage = 'Iniciando...';

    const isPaidPlan = this.isPaidPlan;
    let paymentMethodId = null;

    if (isPaidPlan) {
      this.loadingMessage = 'Validando pagamento...';
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement,
        billing_details: {
          name: this.registerForm.value.nome,
          email: this.registerForm.value.email
        }
      });

      if (error) {
        this.cardErrors = error.message;
        this.loadingMessage = null;
        return;
      }
      paymentMethodId = paymentMethod.id;
    }

    const registrationData = {
      ...this.registerForm.value,
      plano_id: this.choosedPlan,
      payment_method_id: paymentMethodId,
    };

    this.loadingMessage = 'Preparando assinatura...';
    this.registerService.prepareRegister(registrationData).subscribe({
      next: (response: any) => {
        if (isPaidPlan) {
            const finalizationData = {
                ...registrationData,
                payment_intent_id: response.payment_intent_id
            };
            this.finalizeRegistration(finalizationData);
        } else {
            this.loadingMessage = null;
            this.loadingService.toastr('Sucesso!', response.message || 'Registro realizado com sucesso!', 'success');
            this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        if (err.status === 402 && err.error.client_secret) {
          this.loadingMessage = 'Aguardando autenticação...';
          this.loadingService.toastr('Info', 'Aguardando autenticação do banco...', 'info');
          this.handle3DSecure(err.error.client_secret, registrationData);
        } else {      
          const errorMessage = err.error?.message || 'Ocorreu um erro no registro.';
          this.loadingService.toastr('Erro!', errorMessage, 'error');
          this.loadingMessage = null;
          console.error(err);
        }
      }
    });
  }

  async handle3DSecure(clientSecret: string, registrationData: any) {
    const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret);

    if (error) {
      this.loadingService.toastr('Erro!', 'Falha na autenticação do pagamento: ' + error.message, 'error');
      this.loadingMessage = null;
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      this.loadingService.toastr('Sucesso', 'Pagamento confirmado. Finalizando registro...', 'success');
      const finalizationData = {
          ...registrationData,
          payment_intent_id: paymentIntent.id
      };
      this.finalizeRegistration(finalizationData);
    } else {
      this.loadingService.toastr('Info', 'Pagamento não foi bem-sucedido. Status: ' + (paymentIntent ? paymentIntent.status : 'unknown'), 'info');
      this.loadingMessage = null;
    }
  }

  finalizeRegistration(finalizationData: any) {
    this.loadingMessage = 'Finalizando registro...';
    this.registerService.finalizeRegister(finalizationData).subscribe({
        next: (res: any) => {
            this.loadingMessage = null;
            this.loadingService.toastr('Sucesso!', res.message || 'Registro finalizado com sucesso!', 'success');
            this.router.navigate(['/login']);
        },
        error: (err: any) => {
            this.loadingMessage = null;
            const errorMessage = err.error?.message || 'Ocorreu um erro ao finalizar o registro.';
            this.loadingService.toastr('Erro!', errorMessage, 'error');
            console.error(err);
        }
    });
  }

  isInvalid(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control?.invalid && (control.touched || this.registerFormSubmitted);
  }

  get isPaidPlan(): boolean {
    const selectedPlan = this.planos.find(p => p.id === this.choosedPlan);
    return !!selectedPlan && +selectedPlan.valor_mensal > 0;
  }

  public getListInfoPlanos(): any {
    this.loadingService.show();
    this.registerService.getPlanos().subscribe({
      next: (response: any) => {
        this.planos = response.data;
        this.freeplan = this.planos.some((p: any) => p.valor_mensal == 0)
        this.loadingService.hide();
      },
      error: (error) => {
        this.loadingService.toastr('Erro!', error.error.message, 'error');
        this.loadingService.hide();
      }
    });
  }

  toggleSenhaVisivel() {
    this.senhaVisivel = !this.senhaVisivel;
  }

  toggleConfirmacaoSenhaVisivel() {
    this.confirmacaoSenhaVisivel = !this.confirmacaoSenhaVisivel;
  }
}

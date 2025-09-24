import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RegisterService } from './register.service';
import { LoadingService } from '../../core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageModule } from 'primeng/message';

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
  public registerForm: FormGroup;
  public registerFormSubmitted: boolean = false;

  senhaVisivel: boolean = false;
  confirmacaoSenhaVisivel: boolean = false;

  stripe: any;
  cardElement: any;
  cardErrors: any;

  constructor(
    private registerService: RegisterService,
    private readonly loadingService: LoadingService,
    private cd: ChangeDetectorRef
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
    const selectedPlan = this.planos.find(p => p.id === planId);
    if (selectedPlan && +selectedPlan.valor_mensal > 0) {
      setTimeout(() => this.mountCard(), 0);
    }
  }

  async onSubmit() {
    this.registerFormSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.loadingService.show();

    const selectedPlan = this.planos.find(p => p.id === this.choosedPlan);
    const isFreePlan = !selectedPlan || +selectedPlan.valor_mensal === 0;

    let paymentMethodId = null;

    if (!isFreePlan) {
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
        this.loadingService.hide();
        return;
      }
      paymentMethodId = paymentMethod.id;
    }

    const registrationData = {
      ...this.registerForm.value,
      plano_id: this.choosedPlan,
      payment_method_id: paymentMethodId,
      url_callback: window.location.origin
    };

    this.registerService.register(registrationData).subscribe({
      next: (response: any) => {
        this.loadingService.toastr('Sucesso!', response.message, 'success');
      },
      error: (err) => {
        if (err.status === 402 && err.error.payment_intent_id) {
          this.handlePaymentAction(err.error.payment_intent_id, paymentMethodId);
        } else {      
          const errorMessage = err.error?.message || 'Ocorreu um erro no registro.';
          this.loadingService.toastr('Erro!', errorMessage, 'error');
          console.error(err);
        }
      },
      complete: () => {
        this.loadingService.hide();
      }
    });
  }

  async handlePaymentAction(paymentIntentId: string, paymentMethodId: string | null) {
    this.loadingService.toastr('Info', 'Aguardando autenticação do banco...', 'info');
    const { paymentIntent, error } = await this.stripe.confirmCardPayment(paymentIntentId);

    if (error) {
      this.loadingService.toastr('Erro!', 'Erro na autenticação 3D Secure: ' + error.message, 'error');
    } else if (paymentIntent.status === 'succeeded') {
      this.loadingService.toastr('Sucesso', 'Autenticação bem-sucedida. Finalizando registro...', 'success');
      const registrationData = {
        ...this.registerForm.value,
        plano_id: this.choosedPlan,
        payment_method_id: paymentMethodId,
        url_callback: window.location.origin
      };
      this.registerService.register(registrationData).subscribe({
        next: (res: any) => {
          this.loadingService.toastr('Sucesso!', res.message, 'success');
        },
        error: (err: any) => {
          const errorMessage = err.error?.message || 'Ocorreu um erro no registro.';
          this.loadingService.toastr('Erro!', errorMessage, 'error');
          console.error(err);
        }
      });
    }
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

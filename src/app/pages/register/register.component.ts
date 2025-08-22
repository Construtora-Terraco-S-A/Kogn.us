import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import { LoadingService } from '../../core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
  providers: [RegisterService],
})
export class Register implements OnInit {

  public planos: any[] = [];
  public freeplan: boolean = false;

  constructor(
    private registerService: RegisterService,
    private loadingService: LoadingService
  ){}

  ngOnInit(){
    this.getListInfoPlanos()
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
        this.loadingService.notify('Erro!', error.error.message);
      }
    });
  }

}

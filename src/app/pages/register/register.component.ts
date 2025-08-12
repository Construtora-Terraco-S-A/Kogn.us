import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import { LoadingService } from '../../core';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
  providers: [RegisterService],
})
export class Register implements OnInit {

  public planos: any = [];

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
        this.planos = response;
        this.loadingService.hide();
      },
      error: (error) => {
        this.loadingService.notify('Erro!', error.error.message);
      }
    });
  }

}

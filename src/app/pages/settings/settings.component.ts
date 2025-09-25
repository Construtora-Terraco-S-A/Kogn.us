import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-settings',
  imports: [
    TabsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  encapsulation: ViewEncapsulation.None
})
export class Settings implements OnInit{

  tab: number = 0;
  me: any = {};
  public userForm: FormGroup;

  constructor() {
    this.userForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
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

  public dados(): any {
    const session = JSON.parse(localStorage.getItem('session') ?? '{}');
    const user = session?.usuario || {};
    this.me = user;
    return this.setValueDados()
  }

  public setValueDados(): void {
    this.userForm.patchValue({
      nome: this.me.nome,
      email: this.me.email
    });
  }
}

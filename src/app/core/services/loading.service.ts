import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly messageService: MessageService) { }

  show(): void {
    setTimeout(() => {
      this._loading.next(true);
    }, 100);
  }

  hide(): void {
    setTimeout(() => {
      this._loading.next(false);
    }, 100);
  }

  get loading$(): Observable<boolean> {
    return this._loading.asObservable();
  }

  notify(
    titulo: string = "Aviso!", 
    mensagem: string = "Não foi possível fazer o download!", 
    redirect?: any, 
    func?: any
  ) {
    this.messageService.clear();
    this.messageService.add({
      key: 'block2',
      severity: 'custom-2',
      summary: titulo,
      closable: false,
      detail: mensagem,
      contentStyleClass: 'p-0',
      redirect: redirect,
      func: func
    } as any);
    this.hide();
  }

  toastr(
    titulo: string = "Aviso!",
    mensagem: string = "Não foi possível fazer o download!", 
    severity: string = 'success'
  ) {
    this.messageService.clear();
    this.messageService.add({
      key: 'toastr',
      severity: severity,
      summary: titulo,
      closable: false,
      detail: mensagem,
      contentStyleClass: 'p-0'
    } as any);
    this.hide();
  }
}

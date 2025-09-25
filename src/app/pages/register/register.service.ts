import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../../env';

@Injectable()
export class RegisterService {

  private readonly baseUrl: string = apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * * Carrega planos disponíveis para escolha de registro
   * @return []
   */
  public getPlanos(){
    return this.http.get(`${this.baseUrl}/planos`)
  }

  /**
   * * Registra o perfil do usuário em conjunto com o plano escolhido
   * @return []
   */
  public register(data: any){
    return this.http.post(`${this.baseUrl}/preparar-assinatura`, data)
  }

  public finalizeRegister (data: any)  {
    return this.http.post(`${this.baseUrl}/finalizar-registro`, data)
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../../env';

@Injectable()
export class SettingsService {

  private readonly baseUrl: string = apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * * Atualizar senha
   * @return []
   */ 
  public atualizarSenha (data: any){
    return this.http.put(`${this.baseUrl}/atualizar-senha`, data)
  }

}

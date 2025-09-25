import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../../env';

@Injectable({ providedIn: 'root' })
export class HeaderService {

  private readonly baseUrl: string = apiUrl;

  constructor(
    private http: HttpClient
  ) { }


  /**
   * * Esqueci a senha
   * @return []
   */
  public forgotPassword(email: string){
    return this.http.post(`${this.baseUrl}/recuperar-senha`, { email })
  }


}

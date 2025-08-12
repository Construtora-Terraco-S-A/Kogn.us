import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../../env';

@Injectable()
export class RegisterService {

  private readonly baseUrl: string = apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getPlanos(){
    return this.http.get(`${this.baseUrl}/planos`)
  }

}

import { inject, Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}`;

  private router = inject(Router);
  constructor(private http: HttpClient) {}

  login(credenciais: { login: string; senha: string }) {
    return this.http.post(`${this.apiUrl}/auth/login`, credenciais, {
      withCredentials: true, // <- permite receber e enviar cookies
    });
  }

  cadastrar(data: any): Observable<any> {
    const url = `${this.apiUrl}/auth/register`;

    return this.http
      .post(url, data)
      .pipe(catchError((error) => throwError(() => error)));
  }

  logout() {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  clearToken() {
    sessionStorage.removeItem('token');
  }

  setUser(info: any)
  {
    let objeto = {
      id_usuario: info.id_usuario,
      nm_usuario: info.id_usuario,
      login: info.login,
    };
    sessionStorage.setItem('user', JSON.stringify(objeto));
  }

  getUser()
  {
    let user = sessionStorage.getItem('user');
    let objeto = user !== null ? JSON.parse(user) : null;
    console.log(objeto);
    return objeto;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `${token}`,
    });
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Message } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root',
})
export class Baseservice {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  obterNomeUsuario(id_usuario: string): Observable<any> {
    const url = `${this.apiUrl}/usuario/${id_usuario}`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        return res.userNome;
      }),
      catchError((e) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao consultar o objeto!',
          text: e.error.error,
          confirmButtonText: 'OK',
        });
        return throwError(() => e);
      })
    );
  }

  obterTodos(endpoint: string): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}/`;

    return this.http.get<any>(url).pipe(
      tap((res) => {
        return res;
      }),
      catchError((e) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao consultar!',
          text: e.error.error,
          confirmButtonText: 'OK',
        });
        return throwError(() => e);
      })
    );
  }

  obterPorId(endpoint: string, id: number): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;

    return this.http.get<any>(url).pipe(
      tap((res) => {
        return res;
      }),
      catchError((e) => {
        console.log(e);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao consultar por ID!',
          text: e.error.message,
          confirmButtonText: 'OK',
        });
        return throwError(() => e);
      })
    );
  }

  cadastrar(endpoint: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}/`;

    return this.http.post<any>(url, data).pipe(
      tap((res) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'success',
          title: 'Cadastrado com sucesso!',
        });
        return res;
      }),
      catchError((e) => {
        console.log(e);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao salvar!',
          text: e.error.message,
          confirmButtonText: 'OK',
        });
        return throwError(() => e);
      })
    );
  }

  atualizar(endpoint: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}/`;

    return this.http.put<any>(url, data).pipe(
      tap((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Atualizado com sucesso!',
          confirmButtonText: 'OK',
        });
        return res;
      }),
      catchError((e) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao salvar!',
          text: e.error.error,
          confirmButtonText: 'OK',
        });
        return throwError(() => e);
      })
    );
  }

  deletar(endpoint: string, id: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;

    return this.http.delete<any>(url).pipe(
      tap((res) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'success',
          title: res?.message || 'Registro deletado com sucesso.',
        });
      }),
      catchError((e) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: e?.error?.error || 'Erro ao deletar o registro.',
          confirmButtonText: 'OK',
        });
        return throwError(() => e);
      })
    );
  }
}

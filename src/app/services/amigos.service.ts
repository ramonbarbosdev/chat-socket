import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AmigosService {
  private readonly apiUrl = `${environment.apiUrl}/friendship`;

  constructor(private http: HttpClient) {}

  obterAmigoPendente(id_usuario: string): Observable<any> {
    const url = `${this.apiUrl}/pendente/${id_usuario}`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        return res;
      }),
      catchError((e) => {
        console.log(e.error.message);
        return throwError(() => e);
      })
    );
  }
  obterAmigoTodos(id_usuario: string): Observable<any> {
    const url = `${this.apiUrl}/amigos/${id_usuario}`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        return res;
      }),
      catchError((e) => {
        console.log(e.error.message);
        return throwError(() => e);
      })
    );
  }

  aceitarConvite(id_usuario: string, id_friendship: string): Observable<any> {
    const url = `${this.apiUrl}/aceitar/${id_usuario}/${id_friendship}`;

    return this.http.post<any>(url, null).pipe(
      map((res) => {
        return res;
      }),
      catchError((e) => {
        console.log(e);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao enviar o objeto!',
          text: e.error.message,
          confirmButtonText: 'OK',
        });
        return throwError(() => e);
      })
    );
  }

  recusarConvite(id_usuario: string, id_friendship: string): Observable<any> {
    const url = `${this.apiUrl}/recusar/${id_usuario}/${id_friendship}`;

    return this.http.post<any>(url, null).pipe(
      map((res) => {
        return res;
      }),
      catchError((e) => {
        console.log(e);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao enviar o objeto!',
          text: e.error.message,
          confirmButtonText: 'OK',
        });
        return throwError(() => e);
      })
    );
  }

  remover(id_friendship: string): Observable<any> {
    const url = `${this.apiUrl}/${id_friendship}`;

    return this.http.delete<any>(url).pipe(
      map((res) => {
        return res;
      }),
      catchError((e) => {
        console.log(e);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao enviar o objeto!',
          text: e.error.message,
          confirmButtonText: 'OK',
        });
        return throwError(() => e);
      })
    );
  }

  getOnlineUsers(id_usuario: string): Observable<any[]> {
    const url = `${this.apiUrl}/amigos-online/${id_usuario}`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        return res;
      }),
      catchError((e) => {
        console.log(e);

        return throwError(() => e);
      })
    );
  }

  obterAmigoDisponivel(id_usuario: string): Observable<any> {
    const url = `${this.apiUrl}/amigo-disponivel/${id_usuario}`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        return res;
      }),
      catchError((e) => {
        return throwError(() => e);
      })
    );
  }

  enviarConviteAmigo(
    id_requester: string,
    id_receiver: string
  ): Observable<any> {
    {
      const url = `${this.apiUrl}/convidar/${id_requester}/${id_receiver}`;
      return this.http.post<any>(url, null).pipe(
        tap((res) => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Convite enviado com sucesso!',
            confirmButtonText: 'OK',
          });
          return res;
        }),
        catchError((e) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao enviar!',
            text: e.error.message,
            confirmButtonText: 'OK',
          });
          return throwError(() => e);
        })
      );
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ConviteService {
  private readonly apiUrl = `${environment.apiUrl}/convite`;

  constructor(private http: HttpClient) {}

  obterUsuarioDisponivel(id_room: string, id_usuario: string): Observable<any>
  {
    const url = `${this.apiUrl}/usuario-disponivel/${id_usuario}/${id_room}`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        return res;
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

  enviarConviteSala(id_room: string, id_usuario: string): Observable<any> {
    {
      const url = `${this.apiUrl}/enviar-convite/${id_room}/${id_usuario}`;
      return this.http.get<any>(url).pipe(
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
          console.log(e);
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

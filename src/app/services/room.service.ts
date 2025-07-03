import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly apiUrl = `${environment.apiUrl}/room`;

  constructor(private http: HttpClient) {}

  obterInformacaoSala(id_room: string, id_usuario: string): Observable<any> {
    const url = `${this.apiUrl}/${id_room}/${id_usuario}`;

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

  cadastrarSalaIndividual(
    id_usuario: string,
    id_amigo: string
  ): Observable<any> {
    const url = `${this.apiUrl}/individual/${id_usuario}/${id_amigo}`;

    return this.http.post<any>(url, null).pipe(
      tap((res) => {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Sucesso',
        //   text: 'Cadastrado com sucesso!',
        //   confirmButtonText: 'OK',
        // });
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

  verificarResponsavelSala(
    id_usuario: string,
    id_room: string
  ): Observable<any> {
    const url = `${this.apiUrl}/varificar-responsavel/${id_usuario}/${id_room}`;

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

  removerUsuario(id_usuario: string, id_room: string): Observable<any> {
    const url = `${this.apiUrl}/remover-sala/${id_usuario}/${id_room}`;

    return this.http.delete<any>(url).pipe(
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
}

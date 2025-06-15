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
}

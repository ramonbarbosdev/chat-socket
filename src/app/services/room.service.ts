import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly apiUrl = `${environment.apiUrl}/room`;

  constructor(private http: HttpClient) {}

  verificarResponsavelSala(
    id_usuario: string,
    id_room: string
  ): Observable<any> {
    const url = `${this.apiUrl}/varificar-responsavel/${id_usuario}/${id_room}`;

    console.log(id_usuario, id_room);
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
}

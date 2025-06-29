import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Eventservice {
  private reloadSubject = new Subject<void>();
  reload$ = this.reloadSubject.asObservable();

  emitReloadRoom() {
    this.reloadSubject.next();
  }


  private reloadAmigosSubject = new Subject<void>();
  reloadAmigos$ = this.reloadAmigosSubject.asObservable();

  emitReloadAmigos() {
    this.reloadAmigosSubject.next();
  }
}

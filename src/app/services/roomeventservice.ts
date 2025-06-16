import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Roomeventservice {
  private reloadSubject = new Subject<void>();
  reload$ = this.reloadSubject.asObservable();

  emitReloadRoom() {
    
    this.reloadSubject.next();
  }
}

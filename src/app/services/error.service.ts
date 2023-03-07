import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  errorSubject: Subject<any> = new Subject();
  throwError(message: string){
    this.errorSubject.next(message);
  }
}

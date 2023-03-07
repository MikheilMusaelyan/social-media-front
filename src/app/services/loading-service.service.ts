import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {
  constructor() { }
  loadingSubject: Subject<any> = new Subject();
  messageLoading: Subject<any> = new Subject();

  startLoading(bool: boolean, BOOL?: boolean){
    if(BOOL === true || BOOL === false){
      this.messageLoading.next(BOOL);
      return
    } 
    
    this.loadingSubject.next(bool)
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private http: HttpClient
  ) {}

  getNotifications(twentyCount: number){
    return this.http.get('https://socialmedia.up.railway.app/notifications' + `?fetchTimes=${twentyCount}`)
  }
}

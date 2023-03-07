import { AfterViewInit, Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { socket } from 'src/app/app.component';
import { NgZone } from '@angular/core';
import { NotificationService } from './notification.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnDestroy, AfterViewInit, OnInit {
  twentyCount: number = 1
  notifications: any[] = [];
  isLoading: boolean = false;
  canFetch: boolean = true;

  constructor(
    private ngZone: NgZone,
    private notificationService: NotificationService,
    private router: Router
  ) {
    socket.on('notification', () => {
      this.getNotifications()
    })
  };

  ngOnInit(): void {
    this.canFetch = true;
    this.isLoading = false;
    this.twentyCount = 1;
    this.notifications = [];

    this.getNotifications();
  }

  getNotifications () {
    if(this.isLoading){
      return
    }
    this.isLoading = true;

    this.notificationService.getNotifications(this.twentyCount).subscribe((data: any) => {
      this.twentyCount++;
      this.isLoading = false;
      
      this.ngZone.run(() => {
        this.notifications.unshift(...data.NOTIFICATIONS)
        // console.log(this.notifications);

        if(data.NOTIFICATIONS?.length < 20){
          this.canFetch = false;
        }
      })
    })
  }


  ngOnDestroy(): void {
    socket.off('notification');
    window.removeEventListener('scroll', this.checkScrollHeight);
    this.notifications = [];
  }

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.checkScrollHeight)
  }

  checkScrollHeight = () => {
    if(document.body.scrollHeight - window.scrollY - window.innerHeight <= 500 && !this.isLoading && this.canFetch == true){
      this.getNotifications()
    }
  }

  relocate(info: any){
    if(info.type == 'userProfile'){
      this.router.navigate([`my_account/${info.linker}`])
    } else if(info.type == 'post') {

    } else {
      
    }
  }
}

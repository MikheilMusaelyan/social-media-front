import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowLeft, faArrowRight, faUser, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { authService } from 'src/app/services/auth.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-active-friends',
  templateUrl: './active-friends.component.html',
  styleUrls: ['./active-friends.component.css']
})
export class ActiveFriendsComponent implements OnInit, OnDestroy{
  constructor(
    private AuthService: authService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) { }

  userIcon = faUser
  friendIcon = faUserFriends;
  leftArrow = faArrowLeft;
  rightArrow = faArrowRight;

  myScrollTo: number = 0;
  friendWidth: number = 110;  
  miniWindow: boolean = false;
  isAuth = this.AuthService.getIsAuth();
  
  myFriendsSubscription: Subscription = new Subscription();
  friendReqSub: Subscription = new Subscription();
  socketReqSub: Subscription = new Subscription();
  
  myFriends: any[] = [];
  friendsLoading: boolean = false;

  @ViewChild('scrollingDiv', {static: false}) scrollingDiv: any;

  ngOnInit(): void {
    if(window.innerWidth < 1170){
      this.miniWindow = true;
    } else {
      this.miniWindow = false;
    }
    if(this.isAuth){
      this.friendsLoading = true;
      this.myFriendsSubscription = this.AuthService.friendsSubject
      .subscribe(data => {
        this.friendsLoading = false;
        this.myFriends = data;
        this.cdr.detectChanges()
      })
      this.AuthService.findFriends()
    };

    // changes by us
    this.friendReqSub = this.AuthService.addFriendSubject
    .subscribe((data: any) => {
      if(data?.change){
        this.AuthService.findFriends();
      }
    })

    // changes by socket
    this.socketReqSub = this.messageService.gotReqSubject
    .subscribe((data: any) => {
      if(data?.changed === true){
        this.AuthService.findFriends();
      }
    })
  };

  ngOnDestroy(): void {
    this.socketReqSub.unsubscribe()
    this.friendReqSub.unsubscribe();
    this.myFriendsSubscription.unsubscribe();
    window.removeEventListener('resize', this.resizeListener)
  };

  ngAfterViewInit(): void {
    window.addEventListener('resize', this.resizeListener)
  };
  
  resizeListener = () => {
    if(window.innerWidth < 1170 && this.scrollingDiv){
      this.miniWindow = true;
      this.scrollingDiv.nativeElement.scrollTo(0, 0)
      this.myScrollTo = 0;
    } else {
      this.miniWindow = false;
    }
  }

  moveLeft(){
    if(this.myScrollTo > this.scrollingDiv.nativeElement.scrollLeft){
      this.myScrollTo = this.scrollingDiv.nativeElement.scrollLeft
    }
    this.myScrollTo -= this.friendWidth
    this.scrollingDiv.nativeElement.scrollTo(this.myScrollTo, 0)
  };

  moveRight(){
    if(this.myScrollTo < 0){
      this.myScrollTo = 0;
    }
    this.myScrollTo += this.friendWidth;
    this.scrollingDiv.nativeElement.scrollTo(this.myScrollTo, 0)
  };
}

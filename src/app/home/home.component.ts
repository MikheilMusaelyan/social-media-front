import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PostService } from '../services/post.service';
import { Subscription } from 'rxjs';
import { authService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';
import { faBell, faHome, faMessage, faPlus, faSignIn, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('main', [
      state('void', style({
        'opacity': 0
      })),
      state('show', style({
        'opacity': 1
      })),
      transition('void <=> *', animate(300))
    ])
  ]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  profile = faUser
  home = faHome
  signup = faPlus
  login = faSignIn
  logOut = faSignOut
  messages = faMessage
  notifications = faBell

  main = 'void';
  isAuth: boolean = false;
  authSub: Subscription = new Subscription()
  miniWindow: boolean = false;
  accOpened: boolean = false;
  myAccSubscription: Subscription = new Subscription();
  gotPostsSubscription: Subscription = new Subscription();

  constructor(
    private postService: PostService,
    private authService: authService,
    private router: Router,
    private messageService: MessageService
  ){
    this.myAccSubscription = this.postService.myAccSubject
    .subscribe((bool: boolean) => {
      this.accOpened = bool;
      this.detectWindow();
    })
  }

  
  ngOnInit(): void {
    setTimeout(() => {
      this.main = 'show'
    }, 150);

    this.isAuth = this.authService.getIsAuth();
    this.authSub = this.authService.getAuthStatus()
    .subscribe(AuthStatus => {
      this.isAuth = AuthStatus;
    });
  };

  ngAfterViewInit(): void {
    window.addEventListener('resize', this.detectWindow)
  };

  detectWindow = () => {
    if(window.innerWidth <= 1170 && this.accOpened == true){
      this.miniWindow = true;
    } else {
      this.miniWindow = false;
    }
  };

  ngOnDestroy(): void {
    this.myAccSubscription.unsubscribe();
    this.authSub.unsubscribe()
    window.removeEventListener('resize', this.detectWindow)
  }
  toMyAcc(){
    this.router.navigate(['/my_account', this.authService.getUserId()]);
  }
  logout(){
    let ID = this.authService.getUserId();
    this.messageService.logOut(ID);
    this.authService.logout();
  }
  toMessages(){
    this.messageService.changeState(false)
    this.router.navigate(['/messages'])
  }
}

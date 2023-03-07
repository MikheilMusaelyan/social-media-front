import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { authService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('liwrap', [
      state('void', style({
        'opacity': 0,
      })),
      state('open', style({
        'opacity': 1,
      })),
      transition('* <=> void', animate('200ms ease-out')),
    ])
  ]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Output() openEmitter: EventEmitter<any> = new EventEmitter();
  isAuth = false;
  myId: any;
  showNav: boolean = true;
  menuIcon = faList;
  openLis: boolean = false;
  liwrap: any = 'void';

  constructor(
    private authService:authService, 
    private router: Router,
    private messageService: MessageService
  ){
  }

  ngOnInit(): void {
    this.isAuth = this.authService.getIsAuth();
    this.authService.getAuthStatus()
    .subscribe(AuthStatus => {
      this.isAuth = AuthStatus;
    });

    this.messageService.informNavState.subscribe(status => {
      if(status){
        this.showNav = true;
      } else {
        this.showNav = false
      }
    }) 
  };

  ngAfterViewInit() {
  }
  
  toMyAcc(){
    this.myId = this.authService.getUserId();
    this.router.navigate(['/my_account', this.myId]);
    this.openLis = false;
  }
  window(){
    this.openEmitter.emit(true)
  }
  logout(){
    let ID = this.authService.getUserId();
    this.messageService.logOut(ID);
    this.authService.logout();
    this.openLis = false;
  }
  
  // getUsers(){
  //   this.authService.getUsers()
  // }

  toMessages(){
    this.messageService.changeState(false)
    this.router.navigate(['/messages'])
    this.openLis = false;
  }

  changeLis(){
    this.openLis = !this.openLis
    if(this.openLis){
      this.liwrap = 'open'
    }
  }
}

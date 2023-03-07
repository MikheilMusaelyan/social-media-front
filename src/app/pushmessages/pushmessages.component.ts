import { animate, state, style, transition, trigger} from '@angular/animations';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-pushmessages',
  templateUrl: './pushmessages.component.html',
  styleUrls: ['./pushmessages.component.css'],
  animations: [
    trigger('notification', [
      state('closed', style({
        'transform': 'translateY(-300%)',
      })),
      state('open', style({
        'transform': 'translateY(65px)',
      })),
      transition('open <=> closed', animate('500ms ease-out'))
    ])
  ]
})
export class PushmessagesComponent implements OnInit, OnDestroy{
  // @Output() msgEmitter: EventEmitter<any> = new EventEmitter();
  messageSubscription: Subscription;
  notification = 'closed'
  newMsg: any;
  timeoutId: any;

  userIcon = faUser;

  constructor(
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private router: Router
  ) {
    this.messageSubscription = this.messageService.messageSubject
    .subscribe(data => {
      this.newMsg = data;
      this.notification = 'open'
      this.cdr.detectChanges();

      if(this.timeoutId){
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = setTimeout(() => {
        this.notification = 'closed'
        this.cdr.detectChanges()
        this.clearMsg()
      }, 3000);

    });
  };

  clearMsg() {
    setTimeout(() => {
      this.timeoutId = null
      this.newMsg = null;
    }, 350);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

  goToMessages(){
    this.router.navigate(['/messages']);
    this.messageService.changeState(true);
    this.messageService.convBoxData(
      {
        _id: this.newMsg?.sender, 
        nickname: this.newMsg?.nickname, 
        profilePic: this.newMsg?.profPic
      }
    )
  }
}

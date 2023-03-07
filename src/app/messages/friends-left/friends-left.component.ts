import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { authService } from 'src/app/services/auth.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-friends-left',
  templateUrl: './friends-left.component.html',
  styleUrls: ['./friends-left.component.css']
})
export class FriendsLeftComponent implements OnInit, OnDestroy {
  @ViewChildren('eTargets') eTargets: any;

  contactsIcon = faMessage;
  userIcon = faUser;

  contactsSubscripton: Subscription;
  @Output() stateEmitter: EventEmitter<any>  = new EventEmitter();
  myFriendsSubscription = new Subscription();
  myFriends: any[];

  constructor(
    private AuthService: authService,
    private messageService: MessageService
  ) { 
    if(this.AuthService.getIsAuth()){
      this.myFriendsSubscription = this.AuthService.contactsSubject
      .subscribe(data => {
        this.myFriends = data;
      })

      this.AuthService.findContacts();
      
      this.contactsSubscripton = this.messageService.renewContacts.subscribe(data => {
        this.AuthService.findContacts();
      })
    };
  }
  
  exportFriendInfo(friend: any, event: any){
    if(window.innerWidth > 1000){
      this.eTargets._results.forEach((e: any) => {
        e.nativeElement.classList.remove('pointerEvents')
      });
      event.classList.add('pointerEvents')
    }
    this.stateEmitter.emit(true)
    this.messageService.convBoxData(friend);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.contactsSubscripton.unsubscribe()
    this.myFriendsSubscription.unsubscribe()
  }
}

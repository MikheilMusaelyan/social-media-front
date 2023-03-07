import { Location } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy, AfterViewInit {
  // mySelfSubscription: Subscription;
  stateSubscription: Subscription = new Subscription();
  myFriends: any[] = [];
  openMessages: boolean = false;
  miniWindow: boolean = false;
  goBackIcon = faArrowLeft;
  @ViewChildren('mWrap') mainWrap: any;

  constructor(
    private messageService: MessageService,
    private location: Location,
  ) { 
    this.openMessages = this.messageService.currentState
    this.stateSubscription = this.messageService.stateSubject
    .subscribe(bool => {
      this.openMessages = bool;
    })
  }

  changeState(e: any) {
    if(this.miniWindow){
      if(e === true){
        this.openMessages = true;
      } else {
        this.openMessages = false;
      }
    }
  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', this.resizeListener);

    this.mainWrap.forEach((element: any) => {
      element.nativeElement.classList.add('transition')
    });

    this.messageService.changeNav(false);
  }

  resizeListener = () => {
    this.miniWindow = this.messageService.checkWidth();
  }

  goBack(){
    this.location.back();
  }

  ngOnInit(): void {
    this.miniWindow = this.messageService.checkWidth();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    this.messageService.changeNav(true);

    this.messageService.currentState = false;
    this.stateSubscription.unsubscribe();
  }
  
}

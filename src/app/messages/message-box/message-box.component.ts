import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faArrowLeft, faCircle, faClose, faPaperPlane, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { authService } from 'src/app/services/auth.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css'],
  animations: [
    trigger('main', [
      state('initial', style({
        'opacity': 0
      })),
      state('show', style({
        'opacity': 1
      })),
      transition('show => initial', animate(0)),
      transition('initial => show', animate(250))  
    ])
  ]
})
export class MessageBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private authService: authService,
    private MessageService: MessageService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingServiceService
  ) {
    this.messageSubscription = this.MessageService.friendEmitter
    .subscribe(data => {
      if(data.friend){
        //initialize
        this.messagesArr = [];
        this.msgPosition = 0;
        this.friendData = data.friend;
        this.MessageService.openMsgId = data.friend._id
        this.canFetch = true;
        this.scrolledInitially = false;

        this.scrollToBottom();

        // reset previous message
        this.messageForm.reset();
        this.imgToShow = undefined;

        // animation
        this.main = 'initial';
        setTimeout(() => {
          this.main = 'show';
        }, 150);
      };

      this.messagesArr.unshift(...data.messages);
      
      if(data.messages.length < 20){
        this.canFetch = false;
      } else {
        this.canFetch = true;
      }
    })

    this.myId = this.authService.getUserId(); 
  }


  // if(this.messageBox.nativeElement){
        //   this.messageBox.nativeElement.style.scrollBehavior = 'initial'
        //   this.messageBox.nativeElement.scrollTop = 
        //   this.messageBox.nativeElement.scrollHeight - 400
        //   setTimeout(() => {
        //     this.messageBox.nativeElement.style.scrollBehavior = 'smooth'
        //     this.messageBox.nativeElement.scrollTop = 
        //     this.messageBox.nativeElement.scrollHeight
        //   }, 100);
        // }

  closeIcon = faClose;
  circleIcon = faCircle;
  plusIcon = faPlus;
  sendIcon = faPaperPlane;
  userIcon = faUser;
  leftArrow = faArrowLeft;

  @ViewChild('messageBox', {static: false}) messageBox: any;
  @ViewChild('textarea', {static: false}) textarea: any;
  @ViewChild('imgToShowWrap', {static: false}) imgToShowWrap: any;
  @ViewChild('toggle', {static: false}) toggleButton: any;
  @ViewChildren('allMessagesRendered') allMessagesRendered: any;

  messagesArr: any[] = [];
  
  emptyForm = false;
  imgToShow: string;
  messageSubscription: Subscription;
  sendSubscription: Subscription;
  @Output() stateEmitter: EventEmitter<any> = new EventEmitter();
  friendData: any;
  myId: string;
  main = 'initial';
  msgPosition: number = 0;
  canFetch: boolean = false;
  scrolledInitially: boolean = false;
  miniWindow: boolean = false;
  chatLoadSub: Subscription = new Subscription();
  messageSub: Subscription = new Subscription();
  chatLoading: boolean = false;

  messageForm: FormGroup = new FormGroup({
    'message': new FormControl(' '),
    'images': new FormControl(' ')
  })
  
  ngOnInit(): void {
    this.miniWindow = this.MessageService.checkWidth();

    this.messageSub = this.MessageService.receivedMessage.subscribe(msg => {
      msg.date = new Date()
      this.messagesArr.push(msg);
      this.cdr.detectChanges();
      setTimeout(() => {
        this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
      }, 150);
    })

    this.chatLoadSub = this.loadingService.messageLoading.subscribe(data => {
      if(data === true){
        this.messagesArr = [];
        this.friendData = undefined;
      }
      this.chatLoading = data;
    })
  }

  scrollToBottom(){
    this.sendSubscription = this.allMessagesRendered.changes
    .subscribe(() => {
      if(!this.scrolledInitially){
        setTimeout(() => {
          this.scrolledInitially = true;
          this.messageBox.nativeElement.style.scrollBehavior = 'auto';
          this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
          this.sendSubscription.unsubscribe();
          setTimeout(() => {
            this.sendSubscription.unsubscribe();
            this.messageBox.nativeElement.style.scrollBehavior = 'smooth';
          }, 150);
        }, 100);
      }
    })
  }

  goToMain(){
    this.MessageService.openMsgId = undefined;
    this.stateEmitter.emit(false)
  }
  
  ngAfterViewInit(): void {
    window.addEventListener('resize', this.resizeListener)
    //1
    //2
    document.addEventListener('click', (e) => {
      if(this.friendData){
        this.textarea.nativeElement.style.transition = '200ms ease-out'
        if(e.target == this.textarea.nativeElement){
          this.textarea.nativeElement.style.height = 
          `${this.textarea.nativeElement.scrollHeight + "px"}`
        }
        else {
          if(e.target !== this.toggleButton.nativeElement){
            if(this.imgToShowWrap){
              this.textarea.nativeElement.style.height = 
              this.imgToShowWrap.nativeElement.clientHeight + 10 + 'px'
              return
            }
            this.textarea.nativeElement.style.height = '50px'
          }
        }
      }
    })
  }

  pickImg(event:Event) {
    let isValid: boolean = false;
    if(!event){
      return
    }
    const pickedImg = (event.target as HTMLInputElement).files[0];
    const imageTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg"
    ]
    imageTypes.forEach(e => {
      if(pickedImg.type === e){
        isValid = true;
      };
    })
    if(!isValid){
      return
    }
    this.textarea.nativeElement.style.height = '110px'

    this.messageForm.patchValue({images: pickedImg});
    this.messageForm.get('images').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(pickedImg);
    reader.addEventListener('loadend', () => {
      this.imgToShow = reader.result as string;
      setTimeout(() => {
        this.messageBox.nativeElement.scrollTop = 
        this.messageBox.nativeElement.scrollHeight;
      }, 150);
    })
  }
  
  sendMessage(){
    if(this.messageForm.value.message ||
      this.messageForm.value.images
    ) {
      this.messageBox.nativeElement.style.scrollBehavior = 'smooth';

      if(!this.messageForm.value.images){
        this.messageForm.value.images = '';
      }
      this.messagesArr.push({
        message: this.messageForm.value.message,
        image: this.messageForm.value.images,
        isNew: true,
        date: new Date(),
        sender: this.myId,
        imgToShow: this.imgToShow,
        friendSocket: this.friendData._id
      });

      this.messageForm.reset();
      this.imgToShow = undefined;
      this.textarea.nativeElement.style.height = '50px'
      setTimeout(() => {
        this.messageBox.nativeElement.scrollTop = 
        this.messageBox.nativeElement.scrollHeight;
      }, 100);
    }
  }

  toggleForm(form: any, messageDiv: any, toggle: any){
    this.toggleButton.nativeElement.style.pointerEvents = 'none';
    setTimeout(() => {
      this.toggleButton.nativeElement.style.pointerEvents = 'auto';
    }, 210);
    this.emptyForm = !this.emptyForm;
    if(!this.emptyForm){
      messageDiv.classList.remove('openTextTransition')
      form.style.paddingTop = '10px'
      toggle.style.margin = '0 10px 10px 0'
      form.classList.remove('formEmpty');
      setTimeout(() => {
        form.style.paddingTop = '0'
        messageDiv.classList.remove('display');
        setTimeout(() => {
          messageDiv.classList.remove('msgWrapClose');
          messageDiv.classList.remove('opacity0')
        }, 50);
      }, 100);
    }
    
    else {
      messageDiv.classList.add('openTextTransition')
      messageDiv.classList.add('msgWrapClose');
      messageDiv.classList.add('opacity0')
      form.classList.add('formEmpty');

      setTimeout(() => {
        messageDiv.classList.add('display')
      }, 300);
    }
  }

  
  ngOnDestroy(): void {
    this.messageSub.unsubscribe();
    this.messagesArr = [];
    this.friendData = undefined;
    this.MessageService.openMsgId = undefined;
    this.messageSubscription.unsubscribe();
    this.chatLoadSub.unsubscribe();
    window.removeEventListener('resize', this.resizeListener)
    if(this.sendSubscription){
      this.sendSubscription.unsubscribe();
    }
  }

  resizeListener = () => {
    this.miniWindow = this.MessageService.checkWidth();
  }

  msgOnScroll(e: any){
      if(e.target.scrollTop < 150){
        if(this.canFetch){
          this.canFetch = false;
          this.msgPosition += 20;
          this.MessageService.convBoxData(null, this.msgPosition);
        }
    }
  }
}

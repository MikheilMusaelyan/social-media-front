import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { PostService } from 'src/app/services/post.service';
import { authService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-acc',
  templateUrl: './my-acc.component.html',
  styleUrls: ['./my-acc.component.css'],
  animations: [
    trigger('main', [
      state('initial', style({
        'opacity': 0
      })),
      state('show', style({
        'opacity': 1
      })),
      transition('initial => show', animate(300)),
      transition('show => initial', animate(100)),
    ])
  ]
})
export class MyAccComponent implements OnInit, OnDestroy {
  messageIcon = faMessage;

  main = 'initial'
  userId: string;
  userObject: any;
  myAcc: boolean = false;
  myAccInfo: any;
  myId: string = this.authService.getUserId();
  isAuth: boolean = this.authService.getIsAuth();
  buttonMessage: string = ''
  haveRecieved = false;
  haveSent = false;
  coverPreview: string = null;
  profilePreview: string = null;
  userIcon = faUser;
  friendDataLoading: boolean = false;
  friendReqSub: Subscription = new Subscription();
  reqSocketSubject: Subscription = new Subscription();

  ngOnInit(): void {
    // socket
    this.reqSocketSubject = this.messageService.gotReqSubject
    .subscribe((data: any) => {
      if(data.senderId !== this.userObject._id){
        return
      };
      this.haveRecieved = false;
      if(data.message === 'Confirm'){ 
        this.haveRecieved = true; // open reject button
      }
      this.buttonMessage = data.message;
      this.cdr.detectChanges();
    })
  }

  ngOnDestroy(): void {
    this.reqSocketSubject.unsubscribe();
    this.friendReqSub.unsubscribe();
    this.userObject = undefined;
    this.myAccInfo = undefined;
    this.postService.accOpened(false);
  }

  constructor(
    private ActiveRoute: ActivatedRoute, 
    private authService: authService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private postService: PostService,
    private router: Router
  ) {
    this.postService.accOpened(true);
    this.ActiveRoute.params.subscribe((params:any) => {
      this.haveRecieved = false;
      this.postCountLoading = true;
      this.main = 'initial'
      this.userObject = undefined;
      this.userId = params.userId;
      if(this.userId === this.myId){
        this.myAcc = true;
      } else {
        this.myAcc = false;
      }
      // 2
        this.authService.findUserById(this.userId).subscribe((foundUser:any) => {
          this.userObject = foundUser.returnUser;
          this.main = 'show';
        // 3
          if(!this.myAcc && this.myId) {
            this.authService.findUserById(this.myId).subscribe(data => {
              this.myAccInfo = data;
              // knowing if friends or not
              for(let i of this.myAccInfo.returnUser.afterLogin.friends){
                if(i === this.userId){
                  this.buttonMessage = 'Friends'
                  return
                }
              }
              for(let i of this.myAccInfo.returnUser.afterLogin.gotReqs){
                if(i === this.userId){
                  this.buttonMessage = 'Confirm'
                  this.haveRecieved = true
                  return
                }
              }
              if(!this.haveRecieved){
                for(let i of this.myAccInfo.returnUser.afterLogin.sentReqs){
                  if(i === this.userId){
                    this.buttonMessage = 'You sent a friend request'
                    this.haveSent = true
                    return
                  }
                }
              }
              if(!this.haveSent){
                this.buttonMessage = 'Send a friend request'
              }
            });
          }
        })
    });


    this.friendReqSub = this.authService.addFriendSubject
    .subscribe((data: any) => {
      const changed = data?.change ? true : false; // if we removed or added
      
      // simple stuff
      this.friendDataLoading = false;
      this.haveRecieved = false;
      this.buttonMessage = data.message;
      cdr.detectChanges();
      
      // after we made a change we get a message that other user should see
      this.messageService.addFriendSocket(
        this.userObject._id, // to who
        data.theirMessage, // what message
        this.myId, // check who sent it to change text
        changed // remove or add friend to the list
      );
    })
  }


  addFriend(bool: boolean){
    if(this.myAcc || this.friendDataLoading){
      return
    }
    this.friendDataLoading = true;
    this.authService.addFriend(this.userObject._id, bool);
  }

  getImg(e:any){
    // canceling
    if(!e.img){
      this.profilePreview = null
      this.coverPreview = null
      return
    }
    if(e.type === 'coverImg'){
      this.profilePreview = null;
      if(e.save){
        this.coverPreview = null;
        this.profilePreview = null;
        this.userObject.afterLogin.coverPic = e.img;
        return
      }
      this.coverPreview = e.img
    } else if (e.type === 'profileImg') {
      this.coverPreview = null;
      if(e.save){
        this.coverPreview = null;
        this.profilePreview = null;
        this.userObject.afterLogin.profilePic = e.img;
        return
      }
      this.profilePreview = e.img
    }
  };

  postCountLoading: boolean = true;
  usersPostCount: number;
  getUserPostCount(num: number){
    this.postCountLoading = false;
    this.usersPostCount = num || 0;
  }

  createConnection(){
    this.messageService.createConnection(this.userObject._id)
    .subscribe(data => {
      // send socket
      this.messageService.addContacts(this.userObject._id)
      
      let toSend = {
        nickname: this.userObject.nickname,
        _id: this.userObject._id,
        connected: this.userObject.connected,
        profilePic: this.userObject.afterLogin.profilePic
      };

      this.router.navigate(['/messages']);
      this.messageService.changeState(true);
      this.messageService.convBoxData(toSend)
    }, err => {
      console.log(err)
    })
  }
}
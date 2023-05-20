import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { authService } from './services/auth.service';
import { PostService } from './services/post.service';
import { trigger, state, style, transition, animate } from '@angular/animations'
import { io } from 'socket.io-client';
import { ErrorService } from './services/error.service';
import { LoadingServiceService } from './services/loading-service.service';
import { MessageService } from './services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('imageWrapper', [
      state('void', style({
        'opacity': 0
      })),
      state('open', style({
        'opacity': 1
      })),
      transition('void <=> *', animate(100))
    ]),
    trigger('errMsg', [
      state('close', style({
        'opacity': 0,
      })),
      state('open', style({
        'opacity': 1,
      })),
      transition('open <=> close', animate(200))
    ])
  ]
})

export class AppComponent implements OnInit, OnDestroy{
  @ViewChild('imageWrapper', {static:false}) imageWrapper: any;
  recievedImg = null;
  imgWrapper = 'close';
  imageSubscription: Subscription;
  errorSubscription: Subscription;
  loadingSubscription: Subscription;
  newMsg: any;
  isError: boolean = false;
  errMessage: string = null;
  errMsg: string = 'close';
  isAnim: boolean = false;
  openLoading: boolean = false;
  closeIcon = faClose;

  constructor(
    private postService:PostService,
    private error: ErrorService,
    private loadingService: LoadingServiceService,
    private authService: authService,
    private router: Router
  ){  

    this.imageSubscription = this.postService.openImgSubject
    .subscribe((imageUrl:string) => {
      if(!imageUrl){
        return
      } 
        this.recievedImg = imageUrl;
        this.imgWrapper = 'open'
    });

    this.loadingService.loadingSubject.subscribe(bool => {
      this.openLoading = bool;
    })
  }

  closeFile(){
    this.imgWrapper = 'close'
    this.recievedImg = null;
  }

  ngOnDestroy(): void {
    this.recievedImg = null;
    this.imageSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.errorSubscription = this.error.errorSubject
    .subscribe(data => {
      if(!this.isAnim){
        this.isAnim = true;
        this.isError = true;
        this.errMessage = data;
        setTimeout(() => {
          this.errMsg = 'open'
          setTimeout(() => {
            this.errMsg = 'close'
            setTimeout(() => {
              this.isAnim = false;
              this.errMessage = '';
              this.isError = false
            }, 400);
          }, 2000);
        }, 100);
      }
    })

    const expDate = localStorage?.getItem('expDate')
    if(
      expDate != null || JSON.parse(expDate) != 0 && 
      new Date().getTime() <= new Date(JSON.parse(expDate)).getTime()
    ){
      this.authService.autoLogin()
    } else {
      localStorage.removeItem('tokenData')
      localStorage.removeItem('expDate')
    }
  }

  title = 'social-media';
}

export const socket = io('https://socialmedia.up.railway.app');
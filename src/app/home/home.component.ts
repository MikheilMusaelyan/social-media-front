import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PostService } from '../services/post.service';
import { Subscription } from 'rxjs';

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
  main = 'void';
  miniWindow: boolean = false;
  accOpened: boolean = false;
  myAccSubscription: Subscription = new Subscription();
  gotPostsSubscription: Subscription = new Subscription();

  constructor(
    private postService: PostService
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
    window.removeEventListener('resize', this.detectWindow)
  }
}

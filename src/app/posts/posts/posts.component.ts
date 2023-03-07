import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { faComment, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, AfterViewInit, OnDestroy {
  main = 'initial'
  commentIcon = faComment;
  thumbsUpIcon = faThumbsUp;

  @ViewChildren('allPosts') allPostsRendered: any;
  @Input() userId: string;
  @Input() myId: string

  postSubscription: Subscription = new Subscription;
  isLoading: boolean = true;
  scrollToY: number = 0;
  mode: string;
  posts: any[] = [];
  myAcc: boolean;

  postCount: number = 20;
  canFetch: boolean = true;

  @Output() userPostCountEmitter: EventEmitter<number> = new EventEmitter();

  constructor(
    private postService: PostService,
  ) {
  };

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
    this.postCount = 20;
    this.posts = [];
    this.postSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.myAcc = this.userId === this.myId && 
    this.myId !== undefined && this.myId?.length > 0;

    this.isLoading = true;
    if(!this.userId){
      this.scrollToY = this.postService.getScroll();
      this.mode = 'everyPost'; // MODE: if no @Input, mode is default
    } else {
      this.mode = 'usersPosts'; // MODE: if @Input, we are on user's page
    }

    this.fetchPosts();

    // subscribe to events
    this.postSubscription = this.postService.getPostAddInfo()
    .subscribe(message => {
      if(message.change === 'addedPost'){
        this.posts.unshift(message.post);
        this.postCount += 1
      } 
      else if(message.change === 'deletedPost'){
        this.canFetch = true;
        this.postCount = 20;
        this.posts = [];
        this.isLoading = true;
        this.fetchPosts()
      }
    })
  };

  fetchPosts(){
    if(!this.canFetch){
      return
    };
    this.canFetch = false;
    if(this.mode === 'usersPosts'){
      this.postService.getUsersPosts(this.userId, this.postCount)
      .subscribe(POSTS => {
        this.userPostCountEmitter.emit(POSTS.postCount)
        this.checkPostCount(POSTS.posts);
      })
    } else {
      this.postService.getPosts(this.postCount).subscribe(POSTS => {
        this.checkPostCount(POSTS.posts);
      })
    }
  };

  checkPostCount(posts: any[]){
    this.postCount += 20;
    this.posts.push(...posts);
    this.isLoading = false;
    if(posts.length < 20){
      this.canFetch = false;
    } else {
      setTimeout(() => {
        this.canFetch = true;
      }, 1000);
    }
  }

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.scrollListener)
  };

  scrollListener = () => {
    if(document.body.scrollHeight - window.scrollY - window.innerHeight <= 500 && this.canFetch){
      this.fetchPosts();
    }
  }
}
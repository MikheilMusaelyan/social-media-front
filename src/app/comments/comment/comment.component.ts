import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faComment, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() postId: string;
  @ViewChild('commentsFooter', {static: false}) commentsFooter: any;

  commentIcon = faComment;
  thumbsUpIcon = faThumbsUp;
  postComments: any = [];
  commentSub: Subscription;
  changeSub: Subscription;
  commentsAmount: number = 0;
  increasingAmount: number = 10;
  canFetch: boolean = true;
  
  constructor(
    private commentService:CommentService
  ) { 
    this.changeSub = this.commentService.commentsChanged
    .subscribe(changes => {
      if(changes.change === 'addedComment'){
        this.postComments.unshift(changes.data.postCommentsC);
      } else if(changes.change === 'deletedComment'){
        this.postComments.splice([changes.cIndex], 1)
      } else if(changes.change === 'addedReply'){
        this.postComments[changes.cIndex].replies.push(changes.data.postCommentsC)
      }  else if(changes.change === 'deletedReply'){
        this.postComments[changes.cIndex].replies.splice(changes.rIndex, 1)
      }
    })

    this.commentSub = this.commentService.commentSubject
    .subscribe((comments: any[]) => {
      this.postComments.push(...comments);
      if(comments.length >= this.increasingAmount){
        setTimeout(() => {
          this.canFetch = true;
        }, 1000);
      } else {
        this.canFetch = false;
      }
    })

    window.scrollTo(0, 0)
  }
  
  ngOnInit(): void {
    this.paginateComments();
  };

  paginateComments(){
    if(!this.canFetch){
      return
    }
      this.canFetch = false;
      this.commentService.getPostComments(this.postId, this.commentsAmount, this.increasingAmount);
      this.commentsAmount += this.increasingAmount;
    
  }

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.scrollListener)
  };

  scrollListener = () => {
    if(document.body.scrollHeight - window.scrollY - window.innerHeight <= 500 && this.canFetch == true){
      this.paginateComments()
    }
  } 

  ngOnDestroy(): void {
    this.commentsAmount = 0;
    this.canFetch = false;
    this.postComments = [];
    this.commentSub.unsubscribe();
    this.changeSub.unsubscribe();
    window.removeEventListener('scroll', this.scrollListener)
  }
}

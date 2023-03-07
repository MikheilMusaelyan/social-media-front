import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faComment, faEdit, faThumbsUp, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { authService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-single-comment',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.css']
})
export class SingleCommentComponent implements OnInit {
  @Input() cIndex: number;
  @Input() comment: any;
  @Input() postId: any;

  thumbsUpIcon = faThumbsUp;
  usersIcon = faUser;
  
  isReplying: boolean = false;
  myId: string = this.authService.getUserId();
  replyPosition: number = 0;
  noMoreReplies: boolean = false;
  
  constructor(    
    private authService:authService,
    private commentService: CommentService,
    private router: Router,
    private error: ErrorService,
  ) {
  }

  ngOnInit(): void {
  }

  reply(){
    if(!this.authService.getIsAuth()){
      this.error.throwError('Please log in to add a comment')
      return
    }
    this.isReplying = !this.isReplying;
  };

  getReply(reply: object){
    this.commentService.addReply(reply, this.postId, this.comment._id, this.cIndex,  this.comment.creatorId)
    this.isReplying = false;
  }

  deleteComment(){
    if(this.myId !== this.comment.creatorId){
      return
    }
    const idObject = {
      commentId: this.comment._id,
      postId: this.postId
    }
    this.commentService.onDeleteComment(idObject, this.cIndex)
  }

  returnUserInfo(){
    return {
      creatorId: this.comment.creatorId,
      creatorProfilePic: this.comment.creatorProfilePic,
      creatorNickname: this.comment.creatorNickname,
      date: this.comment.date
    }
  }

  // paginating replies, after
  getMoreReplies(){
    if(!this.noMoreReplies){
      this.commentService.getMoreReplies(this.replyPosition).subscribe((data: any) => {
        this.comment.replies.push(data.replies);
        this.replyPosition += 10;
        if(data.replies.length < 10){
          this.noMoreReplies = true;
        };
      })
    }
  }

  edit(){
    if(!this.authService.getIsAuth() || this.myId != this.comment.creatorId){
      return
    }
    this.router.navigate([
      '/edit-post',
      this.postId, 
      this.comment.creatorProfilePic,
      this.comment.image,
      this.comment.comment,
      this.comment.creatorNickname,

      this.comment._id
    ])
  }
}

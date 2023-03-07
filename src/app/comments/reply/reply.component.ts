import { Component, Input, OnInit } from '@angular/core';
import { faThumbsUp, faUser } from '@fortawesome/free-solid-svg-icons';
import { CommentService } from 'src/app/services/comment.service';
import { authService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['../single-comment/single-comment.component.css']
})
export class ReplyComponent implements OnInit {
  constructor(
    private commentService:CommentService, 
    private authService: authService,
    private router: Router
  ) {}
    
  @Input() cIndex: number;
  @Input() rIndex: number;
  @Input() replyObject: any;
  @Input() commentId: any;

  thumbsUpIcon = faThumbsUp;
  usersIcon = faUser;
  
  isReplying: boolean = false;
  myId: string = this.authService.getUserId();

  ngOnInit(): void {
  }

  reply(){
    if(!this.authService.getIsAuth()){
      return
    }
    this.isReplying = !this.isReplying
  }

  getReply(reply: any){
    this.commentService.addReply(
      reply, 
      this.replyObject.postId, 
      this.commentId,
      this.cIndex,
      this.replyObject.creatorId
    )
    this.isReplying = false;
  }

  deleteReply(){
    if(this.myId !== this.replyObject.creatorId){
      return
    }
    const idObject = {
      postId: this.replyObject.postId,
      commentId: this.commentId,
      replyId: this.replyObject._id
    }
    this.commentService.onDeleteReply(idObject, this.cIndex, this.rIndex)
  };

  edit(){
    if(!this.authService.getIsAuth() || this.myId !== this.replyObject.creatorId){
      return
    }
    this.router.navigate([
      '/edit-post',
      this.replyObject.postId, 
      this.replyObject.creatorPic,
      this.replyObject.image,
      this.replyObject.comment,
      this.replyObject.creatorNickname,

      this.commentId,
      this.replyObject._id
    ])
    // this.commentService.editReply(editObject)
  };
}

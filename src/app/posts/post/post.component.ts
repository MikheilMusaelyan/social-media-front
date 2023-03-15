import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faComment, faEdit, faList, faThumbsUp, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { PostService } from '../../services/post.service';
import { authService } from 'src/app/services/auth.service'; 
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  animations: [
    trigger('wrap', [
      state('void', style({
        'opacity': 0,
        'height': 0
      })),
      state('open', style({
        'opacity': 1,
      })),
      transition('void <=> *', animate('200ms'))
    ])
  ]
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() obtainedPost: any;
  @Input() ind: number;
  @Input() mode: string;

  userId: any = '';
  commentLength = 0;
  editing: boolean = false;
  wrap = 'void';
  animating: boolean = false

  editIcon = faEdit;
  deleteIcon = faTrash;
  listIcon = faList;

  startEdit(){
    this.editing = !this.editing;
    if(this.editing){
      this.wrap = 'open'
    }
  };
  
  returnUserInfo(){
    return {
      creatorId: this.obtainedPost.creatorId,
      creatorProfilePic: this.obtainedPost.creatorProfilePic,
      creatorNickname: this.obtainedPost.creatorNickname,
      date: this.obtainedPost.date
    }
  }

  constructor(
    private router:Router, 
    private postService:PostService, 
    private authService:authService,
    private commentService: CommentService
  ) {
    this.userId = this.authService.getUserId();
  }
  usersIcon = faUser;
  commentIcon = faComment;
  thumbsUpIcon = faThumbsUp;

  ngOnInit(): void {
    // this commentsLength
  }
  ngOnDestroy(): void {
    this.obtainedPost = null;
  }

  navigateComments(){
    this.postService.saveScroll(scrollY);
    this.commentService.getSinglePost(this.obtainedPost._id)
  };

  onDelete(){
    if(this.obtainedPost.creatorId !== this.authService.getUserId()){
      return
    }
    this.postService.onDelete(this.obtainedPost._id, this.ind, this.mode)
  };

  onEdit(){
    if(this.obtainedPost.creatorId !== this.authService.getUserId()){
      return
    }
    this.postService.saveScroll(scrollY);
    this.router.navigate([
      'edit-post', 
      this.obtainedPost._id, 
      this.obtainedPost.creatorProfilePic, 
      this.obtainedPost.image, 
      this.obtainedPost.post,
      this.obtainedPost.creatorNickname,
    ])
  };

  likePost(){
    // this.postService.onPostLike(this.obtainedPost._id, this.obtainedPost.creatorId)
    // console.log(this.obtainedPost._id)
  }

  seeUser(){
    this.router.navigate(['/my_account', this.obtainedPost.creatorId])
  }
}

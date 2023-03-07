import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faComment, faImage, faThumbsUp, faUser } from '@fortawesome/free-solid-svg-icons';
import { authService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { CommentService } from '../../services/comment.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit, OnDestroy {
  usersIcon = faUser;
  commentIcon = faComment;
  thumbsUpIcon = faThumbsUp;
  imgIcon = faImage;

  postData: any;
  editForm: FormGroup;
  pickedImage: string;
  editMode: string;
  postIndex: number;

  constructor(
    private activeRoute:ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    private authService: authService,
    private errorService: ErrorService
  ) {
    this.activeRoute.params.subscribe(postData => {
      this.pickedImage = postData['img'];
      this.postData = postData;
      // form
      this.editForm = new FormGroup({
        'post': new FormControl(postData['post'], [Validators.required]),
        'image': new FormControl(postData['img']),
      })

      if(postData['replyId']){
        this.editMode = 'reply'
      } else if(postData['commentId']){
        this.editMode = 'comment'
      } else{
        this.editMode = 'post'
      }
    })
  };

  pickImage(image:any){
    if(!image){
      return
    }
    const pickedImg = (image.target as HTMLInputElement).files[0];
    this.editForm.patchValue({image: pickedImg});
    this.editForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(pickedImg);
    reader.addEventListener('loadend', () => {
      this.pickedImage = reader.result as string
    })
  };

  ngOnInit(): void {
  }

  onEdit(){
    if(this.editForm.invalid || this.authService.getIsAuth() === false){
      return this.errorService.throwError('An error has occurred')
    }
    let formInfo: any;
    
    if(typeof(this.editForm.value.image) === 'object'){
      formInfo = new FormData();
      formInfo.append('updatedImage', this.editForm.value.image)
      formInfo.append('updatedPost', this.editForm.value.post)
      formInfo.append('postID', this.postData['postId']);
    } else {
      formInfo = {
        updatedImage: this.editForm.value.image,
        updatedPost: this.editForm.value.post,
        postID: this.postData['postId']
      }
    }

    if(this.editMode === 'reply'){
      this.commentService.editReply(
        formInfo, 
        this.postData['commentId'], 
        this.postData['replyId']
      )
    } else if(this.editMode === 'comment'){
      this.commentService.editComment(
        formInfo,
        this.postData['commentId']
      )
    } else {
      this.postService.onEdit(formInfo);
    }
    formInfo = new FormData()
  }

  cancelImage(){
    this.editForm.value.image = '';
    this.pickedImage = '';
  }

  ngOnDestroy(): void {
    this.pickedImage = '';
    this.editForm = new FormGroup({});
    this.postData = null;
    this.editMode = '';
  }
}

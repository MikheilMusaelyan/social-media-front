import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faClose, faImage, faThumbsUp, faUser } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { authService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css'],
})
export class AddCommentComponent implements OnInit, OnDestroy {
  @Input() postId: string;
  subscription: Subscription = new Subscription();
  @ViewChild('tArea', {static: false}) tArea: any;

  constructor(
    private authService:authService,
    private error: ErrorService,
    private commentService: CommentService
  ) { 
    this.subscription = this.authService.getProfPic().subscribe(d => {
      this.myProfilePic = d
    });
    this.myProfilePic = this.authService.mySelf?.profilePic
  }

  imageIcon = faImage;
  thumbsUpIcon = faThumbsUp;
  usersIcon = faUser;
  closeIcon = faClose;

  pickedImage:string = '';
  isAuth: boolean = false;
  myProfilePic: any;

  commentForm:FormGroup = new FormGroup({
    'comment': new FormControl('', [Validators.required]),
    'image': new FormControl('')
  })
  
  ngOnInit(): void {
    this.isAuth = this.authService.getIsAuth();
  }

  closeImage(){
    this.commentForm.value.image = '';
    this.pickedImage = null;
  }

  onSubmit(){
    if(!this.isAuth){
      this.commentForm.reset();
      this.pickedImage = '';
      this.error.throwError('Please log in to add a comment')
      return;
    }
    if(this.commentForm.invalid){
      this.error.throwError('Please don\'t submit empty comment')
      return;
    };
    
    const commentValue = {
      comment: this.commentForm.value.comment,
      image: this.commentForm.value.image,
      replies: []
    }
    this.commentService.addComment(
      commentValue.comment, 
      commentValue.image, commentValue.replies, this.postId
    )
    this.commentForm.reset();
    this.pickedImage = '';
    this.tArea.nativeElement.style.height = '';
  }
  
  pickImage(image:any){
    let isValid = false;
    if(!image){
      return
    }
    const imageTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg"
    ]
    const pickedImg = (image.target as HTMLInputElement).files[0];
    imageTypes.forEach(e => {
      if(pickedImg?.type === e){
        isValid = true
      }
    })
    if(!isValid){
      return
    }
    this.commentForm.patchValue({image: pickedImg});
    this.commentForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(pickedImg);
    reader.addEventListener('loadend', () => {
      this.pickedImage = reader.result as string
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}

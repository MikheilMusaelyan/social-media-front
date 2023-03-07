import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faImage, faUser } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { authService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { Post } from '../post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  isAuth = false; 
  authSubscripiton: Subscription; 
  subscription: Subscription = new Subscription();

  myProfilePic: string; 
  @ViewChild('tArea', {static: false}) tArea: any; 

  constructor(
    private authService: authService, 
    private postService: PostService,
    private error: ErrorService
  ) {
    // getting auth status
    this.isAuth = this.authService.getIsAuth(); 
    this.authSubscripiton = this.authService.getAuthStatus() 
    .subscribe(auth => { 
      this.isAuth = auth; 
    }); 

    this.subscription = this.authService.getProfPic().subscribe(d => {
      this.myProfilePic = d;
    }); 
    this.myProfilePic = this.authService.mySelf?.profilePic
  };

  pickedImg: string;
  imgIcon = faImage; 
  userIcon = faUser; 

  uploadForm: FormGroup = new FormGroup({
    'postText': new FormControl('', [Validators.required]),
    'postImage': new FormControl(''), 
  }) 

  ngOnDestroy(): void {
    this.authSubscripiton.unsubscribe(); 
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  pickImage(image:any){
    let isValidImg = false;
    if(!image){
      return
    }
    const imageTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg"
    ]
    const pickedImg = (image.target as HTMLInputElement).files[0];
    imageTypes.forEach(type => {
      if(pickedImg.type === type){
        isValidImg = true
      }
    })
    if(!isValidImg){
      return
    }
    this.uploadForm.patchValue({postImage: pickedImg});
    this.uploadForm.get('postImage').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(pickedImg);
    reader.addEventListener('loadend', () => {
      this.pickedImg = reader.result as string
    })
  }; 
  
  addPost(){
    if(!this.uploadForm.valid){
      this.error.throwError('A post must contain text')
      return
    } 
    const post: Post = {
      post: this.uploadForm.value.postText,
      image: this.uploadForm.value.postImage,
      comments: [],
      likes: ' '
    }
    this.postService.addPost(
      post.post, 
      this.uploadForm.value.postImage, 
      post.comments, 
      post.likes
    );
    this.uploadForm.reset();
    this.pickedImg = '';
    this.tArea.nativeElement.style.height = '';
  };
}

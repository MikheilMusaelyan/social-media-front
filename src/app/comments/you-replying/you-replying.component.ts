import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faClose, faComment } from '@fortawesome/free-solid-svg-icons';
import { faUser, faImage } from '@fortawesome/free-solid-svg-icons';
import { authService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
@Component({
  selector: 'app-you-replying',
  templateUrl: './you-replying.component.html',
  styleUrls: ['./you-replying.component.css']
})
export class YouReplyingComponent implements OnInit {
  constructor(
    private authService: authService,
    private error: ErrorService
  ) {}
  imageIcon = faImage;
  commentIcon = faComment;
  closeIcon = faClose;
  usersIcon = faUser;

  pickedImage = null;

  // @Input() editObject: any;
  @Output() commentEmitter: EventEmitter<any> = new EventEmitter();

  replyForm:FormGroup = new FormGroup({
    'comment': new FormControl('', [Validators.required]),
    'image': new FormControl('')
  })

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onSubmit(){
    if(!this.replyForm.valid && this.replyForm.value.comment.length <= 0){
      this.replyForm.reset();
      this.error.throwError('Please don\'t submit an empty comment')
      return
    }
    let toSend = {
      comment: this.replyForm.value.comment,
      image: this.replyForm.value.image,
    }
    
    this.commentEmitter.emit(toSend)
    this.replyForm.reset();
    this.pickedImage = null;
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
    this.replyForm.patchValue({image: pickedImg});
    this.replyForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(pickedImg);
    reader.addEventListener('loadend', () => {
      this.pickedImage = reader.result as string
    })
  }

  closeImage(){
    this.replyForm.value.image = null;
    this.pickedImage = null;
  }
}

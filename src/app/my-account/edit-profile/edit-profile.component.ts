import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { authService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  @Output() imgEmitter: EventEmitter<any> = new EventEmitter();
  @Input() userId: string;
  
  changeProfile: boolean = false;
  changeCover: boolean = false;
  emitObject: any;
  
  editForm: FormGroup = new FormGroup({
    'profileImg': new FormControl('', Validators.required),
    'coverImg': new FormControl('', Validators.required)
  })
  imageIcon = faImage;
  
  constructor(
    private authService: authService
  ) { 

  }

  ngOnInit(): void {
    
  }

  pickImg(image: any, imgType: string){
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
    if(!isValidImg || !imgType){
      return
    }

    // after validations
    if(imgType === 'profileImg'){
      this.changeProfile = true;
      this.changeCover = false;
      this.editForm.patchValue({'profileImg': pickedImg});
    } else if (imgType === 'coverImg'){
      this.changeCover = true;
      this.changeProfile = false;
      this.editForm.patchValue({'coverImg': pickedImg});
    } else {
      return
    }

    this.emitObject = {
      img: '',
      type: imgType,
      save: false,
      userId: this.userId
    }
    this.editForm.get(imgType).updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(pickedImg);
    reader.addEventListener('loadend', () => {
      this.emitObject.img = reader.result as string;
      this.imgEmitter.emit(this.emitObject)
    })
  }

  cancel(){
    this.changeCover = false;
    this.changeProfile = false;
    this.imgEmitter.emit({})
  }

  saveProfilePic(){
    this.changeProfile = false;
    if(this.editForm.value.profileImg && this.editForm.get('profileImg').valid){
      let formInfo = new FormData();
      formInfo.append('profilePic', this.editForm.value.profileImg)
      this.authService.saveProfilePic(formInfo)
      this.emitObject.save = true;
      this.authService.changeProfPic(this.emitObject.img)
      this.imgEmitter.emit(this.emitObject)
    } 
  }

  saveCoverPic(){
    this.changeCover = false;
    if(this.editForm.value.coverImg && this.editForm.get('coverImg').valid){
      let formInfo = new FormData();
      formInfo.append('coverPic', this.editForm.value.coverImg)
      this.authService.saveCoverPic(formInfo)
      this.emitObject.save = true;
      this.imgEmitter.emit(this.emitObject)
    } 
  }
}

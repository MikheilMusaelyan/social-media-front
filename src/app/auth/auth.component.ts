import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ErrorService } from '../services/error.service';
import { authService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  @ViewChild('confirmPass', {static:false}) confirmPass:any;

  constructor(
    private authService: authService,
    private errorService: ErrorService
  ) {
  };
  
  authForm:FormGroup = new FormGroup({
    'email': new FormControl('', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(30)]),
    'nickname': new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]),
    'password': new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)])
  });
  
  isValid = true;
  
  ngOnInit(): void {}

  onSubmit(){
    if(this.authForm.valid && this.authForm.value.password === this.confirmPass.nativeElement.value){
      this.authService.addUser(this.authForm.value)
    } else {
      this.isValid = false
      if(this.authForm.value.password !== this.confirmPass.nativeElement.value){
        this.errorService.throwError('Passwords should match')
        return
      } 
      this.errorService.throwError('An error has occurred')
    }
    this.confirmPass.nativeElement.value = ''
  }
  
  getV(name:string){
    return this.authForm.get(name).invalid && this.authForm.get(name).dirty
  }
}

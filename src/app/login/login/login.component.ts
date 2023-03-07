import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { authService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../auth/auth.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: authService, 
  ) {
  }

  loginForm: FormGroup = new FormGroup({
    'nickname': new FormControl('', [Validators.required]),
    'password': new FormControl('', [Validators.required]),
  });
  
  ngOnInit(): void {
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.authService.login(
        this.loginForm.value.password, 
        this.loginForm.value.nickname,
      )
    };
  };
}

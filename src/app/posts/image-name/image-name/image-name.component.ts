import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { authService } from 'src/app/services/auth.service';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-image-name',
  templateUrl: './image-name.component.html',
  styleUrls: ['./image-name.component.css']
})
export class ImageNameComponent implements OnInit {
  @Input() obtainedPost:any;
  usersIcon = faUser;
  constructor(
    private router: Router,
    private postService:PostService,
  ) {
    
  }

  ngOnInit(): void {
    
  }
  
  seeUser(){
    this.postService.saveScroll(scrollY)
    this.router.navigate(['/my_account', this.obtainedPost.creatorId])
  }
}

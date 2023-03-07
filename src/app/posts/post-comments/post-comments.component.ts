import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faComment, faThumbsUp, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css']
})
export class PostCommentsComponent implements OnInit, OnDestroy {
  constructor(
    private activeRoute: ActivatedRoute, 
  ) { 
  }
  usersIcon = faUser;
  thumbsUpIcon = faThumbsUp;
  commentIcon = faComment;
  postData: any;

  ngOnInit(): void {
    this.activeRoute.params.subscribe(data => {
      this.postData = data;
    })
  }

  ngOnDestroy(): void {
    this.postData = undefined
  }
}

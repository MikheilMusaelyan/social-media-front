import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRight, faClose, faDiagramNext, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  animations: [
    trigger('list', [
      state('void', style({
        'opacity': 0,
        'height': 0,
      })),
      state('open', style({
        'opacity': 1,
      })),
      transition('void <=> *', animate('200ms ease-out')),
    ])
  ]
})
export class SearchBarComponent implements OnInit, AfterViewInit {
  // icons
  searchIcon = faSearch;
  userIcon = faUser;
  nextIcon = faArrowRight;

  stopTypeTimeout: any;
  receivedUsers: any[];
  isLoading: boolean = false;
  list = 'void'
  text: any;
  subscription: Subscription = new Subscription();
  addScroll: boolean = false;
  removeScrollTimeout: any;

  @ViewChild('liwrap', {static: false}) liwrap: any;

  constructor(
    private http: HttpClient,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
  };

  ngAfterViewInit(): void {
    // !!!!!!!!!!!!!!!!
    window.onclick = (e: Event) => {
      // console.log(e.target)
    }
  }

  clearUsers = () => {
    this.receivedUsers = [];
    this.isLoading = false;
    this.text = '';
    this.subscription.unsubscribe();
    this.searchIcon = faSearch;
    clearTimeout(this.removeScrollTimeout);
  }

  search(){
    this.sendReq(this.text);
    this.receivedUsers = [];
  }

  sendReq(searchString: string, timeout = 500){
    clearTimeout(this.stopTypeTimeout);
    if(this.text?.length === 0){
      this.clearUsers();
      this.searchIcon = faSearch;
      return
    } 

    this.searchIcon = faClose;
    this.isLoading = true;

    this.stopTypeTimeout = setTimeout(() => {
      this.getData(searchString)
    }, timeout);
  }

  getData(searchString: string){
    this.subscription = this.http.get('https://socialmedia.up.railway.app/users/searchUsers' + `?searchItem=${searchString}`)
    .subscribe((users: any) => {
      this.list = 'open';
      this.receivedUsers = users.data;
      this.isLoading = false;
    }, error => {
      this.clearUsers();
    })
  };

  animStart(){
    this.addScroll = false;
  }
  animEnd(){
    this.addScroll = true;
  }

  seeUser(id: any){
    this.postService.saveScroll(scrollY)
    this.router.navigate(['/my_account', id._id]);
    this.clearUsers();
    this.searchIcon = faSearch;
  };

  clear(){
    if(this.text?.length > 0){
      this.clearUsers();
      this.searchIcon = faSearch;
    }
  }
}

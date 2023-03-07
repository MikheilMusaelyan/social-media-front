import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login/login.component';
import { MessagesComponent } from './messages/messages/messages.component';
import { MyAccComponent } from './my-account/edit-profile/my-acc/my-acc.component';
import { NotificationsComponent } from './notifications/notifications/notifications.component';
import { EditPostComponent } from './posts/edit-post/edit-post.component';
import { PostCommentsComponent } from './posts/post-comments/post-comments.component';
import { PostsComponent } from './posts/posts/posts.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      {
        path: '',
        component: PostsComponent
      },
      {
        path: 'my_account/:userId', 
        component: MyAccComponent
      },
    ]
  },
  {path: 'signin', component: AuthComponent},
  {path: 'login', component: LoginComponent},
  {path: 'post-comments/:postId/:creatorPic/:img/:title/:date/:nickname/:creatorId', component: PostCommentsComponent},
  {path: 'edit-post/:postId/:creatorPic/:img/:post/:nickname', component: EditPostComponent},
  {path: 'edit-post/:postId/:creatorPic/:img/:post/:nickname/:commentId', component: EditPostComponent},
  {path: 'edit-post/:postId/:creatorPic/:img/:post/:nickname/:commentId/:replyId', component: EditPostComponent},
  {path: 'messages', component: MessagesComponent},
  {path: 'notifications', component: NotificationsComponent},
  {path: "**", redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }

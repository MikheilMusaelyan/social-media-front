import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login/login.component';
import { ErrorInterceptor } from './error-interceptor';
import { AuthInterceptor } from './auth-interceptor';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TextAreaDirective } from './directives/textarea.directive';
import { PostsComponent } from './posts/posts/posts.component';
import { PostCommentsComponent } from './posts/post-comments/post-comments.component';
import { MyAccComponent } from './my-account/edit-profile/my-acc/my-acc.component';
import { CommentComponent } from './comments/comment/comment.component';
import { PostComponent } from './posts/post/post.component';
import { AddCommentComponent } from './comments/add-comment/add-comment.component';
import { FooterDirective } from './directives/footer.directive';
import { datePipe } from './directives/date.pipe';
import { EditPostComponent } from './posts/edit-post/edit-post.component';
import { ReplyComponent } from './comments/reply/reply.component';
import { SingleCommentComponent } from './comments/single-comment/single-comment.component';
import { YouReplyingComponent } from './comments/you-replying/you-replying.component';
import { openImageDirective } from './directives/openImage.directive';
import { ImageNameComponent } from './posts/image-name/image-name/image-name.component';
import { MessagesComponent } from './messages/messages/messages.component';
import { ActiveFriendsComponent } from './messages/active-friends/active-friends.component';
import { MessageBoxComponent } from './messages/message-box/message-box.component';
import { FriendsLeftComponent } from './messages/friends-left/friends-left.component';
import { MessageComponent } from './messages/message/message.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EditProfileComponent } from './my-account/edit-profile/edit-profile.component';
import { SpinnerComponent } from './spinner/spinner/spinner.component';
import { PushmessagesComponent } from './pushmessages/pushmessages.component';
import { SearchBarComponent } from './searchBar/search-bar/search-bar.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { NotificationsComponent } from './notifications/notifications/notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    TextAreaDirective,
    FooterDirective,
    PostsComponent,
    PostCommentsComponent,
    MyAccComponent,
    CommentComponent,
    PostComponent,
    ActiveFriendsComponent,
    AddCommentComponent,
    datePipe,
    EditPostComponent,
    ReplyComponent,
    SingleCommentComponent,
    YouReplyingComponent,
    openImageDirective,
    ImageNameComponent,
    MessagesComponent,
    MessageBoxComponent,
    FriendsLeftComponent,
    MessageComponent,
    EditProfileComponent,
    SpinnerComponent,
    PushmessagesComponent,
    SearchBarComponent,
    CreatePostComponent,
    NotificationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    PickerModule,
    FormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

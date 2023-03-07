import { Component, Input, OnInit } from '@angular/core';
import { socket } from 'src/app/app.component';
import { authService } from 'src/app/services/auth.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private authService: authService
  ) {}
  
  @Input() yourMsg: any;
  @Input() myId: string;
  @Input() profilePic: string;
  thisMessageId: string;
  isMyMessage: boolean = false;
  
  ngOnInit(): void {
    if(this.yourMsg.isNew){
      this.messageService.sendMessage(this.yourMsg)
      .subscribe((data: any) => {
        socket.emit('sendMessage',
          this.yourMsg.friendSocket, 
          {
            message: this.yourMsg.message,
            sender: this.yourMsg.sender,
            imgToShow: data.images,
            nickname: this.authService.mySelf.nickname,
            profPic: this.authService.mySelf.profilePic,
          }
        );
        this.yourMsg = {
          date: Date.now(),
          images: data.images,
          message: this.yourMsg.message,
          _id: data.lastId,
          sender: this.yourMsg.sender,
        }
      }, err => {
        console.log(err)
      })
    } 
  }
}
// date: "2022-11-18T02:33:32.485Z"
// images: ""
// message: "ok, check"
// sender: "6370291a39e4edfc9848ac30"
// _id: "6376eefc82ba5d87d4ae2c0b"

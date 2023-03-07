import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { socket } from "../app.component"
import { LoadingServiceService } from "./loading-service.service";

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    constructor(
        private http: HttpClient,
        private loadingService: LoadingServiceService
    ){
        socket.on('connect', () => {
            if(this.myid){
                socket.emit('join-room', {ID: this.myid})
            }
        })
        socket.on('gotReq', (info) => {
            this.gotReqSubject.next(info)
        })
        socket.on('recieveMessage', (msg) => {
            if(this.openMsgId === msg.sender){
                this.receivedMessage.next(msg)
            } else {
                this.informMessage(msg)
            }
        })

        socket.on('renewContacts', () => {
            this.renewContacts.next(true)
        })
    }


    myid: string;
    friendEmitter: Subject<any> = new Subject();
    messageSubject: Subject<any> = new Subject();
    stateSubject: Subject<boolean> = new Subject();  
    informNavState: Subject<boolean> = new Subject();
    gotReqSubject: Subject<any> = new Subject();
    receivedMessage: Subject<any> = new Subject();
    renewContacts: Subject<any> = new Subject();

    recieverId: string;
    currentState: boolean = false;
    messagesOpen: boolean = false;
    openMsgId: string;

    sendNotification(userId: string){
        socket.emit('notification', userId)
    }

    joinRoom(id: string){
        this.myid = id
        socket.emit('join-room', {ID: id})
    }

    informMessage(msg: any){
        if(msg){
            this.messageSubject.next(msg)
        }
    }

    addFriendSocket(id: string, theirMessage: string, senderId: string, bool: boolean){
        socket.emit('addFriend', 
        {
            id: id,
            senderId: senderId, 
            theirMessage: theirMessage,
            changed: bool
        })
    };

    addContacts(userId: string){
        socket.emit('addedToContacts', userId)
    }

    checkWidth() {
        if(window.innerWidth <= 1000) {
            return true;
        } else {
            return false;
        }
    }

    sendMessage(form: any){
        let Formdata = new FormData();
        if(form.message == null){
            form.message = ' '
        }
        Formdata.append('message', form.message);
        Formdata.append('images', form.image);
        Formdata.append('ID', this.recieverId); 
        return this.http.post('https://socialmedia.up.railway.app/messages', Formdata)
    }

    changeState(bool: boolean){
        this.currentState = bool;
        this.stateSubject.next(this.currentState)
    }

    changeNav(bool: boolean){
        this.messagesOpen = !bool;
        this.informNavState.next(bool);
    }

    convBoxData(friend?: any, amount?: number){
        let msgAmount = 0;
        if(friend){
            this.loadingService.startLoading(true, true);
            this.recieverId = friend._id;
        }
        if(amount){
            msgAmount = amount;
        }
        let queryParams = `?recieverId=${this.recieverId}&amount=${msgAmount}`;
        this.http.get('https://socialmedia.up.railway.app/messages' + queryParams)
        .subscribe((messages: any) => {
            this.loadingService.startLoading(false, false);
            this.friendEmitter.next(
                {
                    messages: messages.msgArr.slice(),
                    friend: friend,
                }
            )
        }, error => {
            console.log(error)
        })
    }

    createConnection(userId: string) {
        return this.http.post('https://socialmedia.up.railway.app/messages/createConnection', 
        {userId: userId}
        )
    }

    logOut(ID: string){
        socket.emit('logout', ID);
    }
}
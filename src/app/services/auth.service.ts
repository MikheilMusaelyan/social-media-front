import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { User } from "../auth/user.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { MessageService } from "./message.service";
import { ErrorService } from "./error.service";

@Injectable({
    providedIn: 'root'
})

export class authService implements OnInit{
    constructor(
        private http: HttpClient,
        private router: Router,
        private messageService: MessageService,
        private errorService: ErrorService
    ) {
        
    }

    authStatusSubject: Subject<boolean> = new Subject();
    addFriendSubject: Subject<any> = new Subject();
    profPicSubject: Subject<string> = new Subject();
    
    friendsSubject: Subject<any> = new Subject();
    contactsSubject: Subject<any> = new Subject();
    isAuth = false;
    token = null;
    userId: string;
    mySelf: any;
    
    ngOnInit():void {
        
    }

    findUserById(id: string){
        let query = `?id=${id}`;
        return this.http.get(
        `https://socialmedia.up.railway.app/users/singleUser` + query)
    }

    addUser(form:any){
        let user: User = {
            nickname: form.nickname,
            email: form.email,
            password: form.password,
            socket: '',
            afterLogin: {
                posts: [],
                profilePic: '',
                coverPic: '',
                birthDate: '',
                sentReqs: [],
                gotReqs: [],
                friends: [],
                connections: [],
                connected: true
            },
        }
        this.http.post('https://socialmedia.up.railway.app/users', user)
        .subscribe((responsee) => {
            this.router.navigate(['/login']);
        }, err => {
            if(err?.keyPattern?.nickname == 1){
                this.errorService.throwError('User with that nickname exists')
            } else if(err?.keyPattern?.email == 1) {
                this.errorService.throwError('User with that email exists')
            }
        })
    };
    
    getUserId(){
        return this.userId;
    }
    getIsAuth(){
        return this.isAuth;        
    }
    getAuthStatus(){
        return this.authStatusSubject.asObservable();
    }

    initialize(){
        this.isAuth = false;
        this.token = null;
        this.userId = null;
        this.authStatusSubject.next(false);
    }

    returnToken(){        
        return this.token;
    }

    login(password: string, nickname: string){
        let user = {
            password: password,
            nickname: nickname,
        }
        this.http.post<{token: string, userId: string, profilePic: string}>('https://socialmedia.up.railway.app/users/login', user)
        .subscribe(response => {
            this.loginFunc(response, nickname)
        }, err => {
            console.log(err)
        })
    };

    loginFunc(response: any, nickname: string, isLoggedIn?:boolean) {
        this.mySelf = {
            nickname:<string> nickname,
            profilePic:<string> response?.profilePic
        }

        if(!isLoggedIn){
            this.token = response.token;
            localStorage.setItem('tokenData', response.token)
            localStorage.setItem('expDate', JSON.stringify(new Date().getTime()) + 60 * 1000 * 3)
        } else {
            this.token = localStorage.getItem('tokenData')
        }

        this.userId = response.userId;
        this.messageService.joinRoom(this.userId);
        this.isAuth = true;
        this.authStatusSubject.next(true);
        this.router.navigate(['/']);
    }

    autoLogin(){
        const token = localStorage.getItem('tokenData')
        const q = `?token=${token}`
        this.http.get('https://socialmedia.up.railway.app/users/autoLogin' + q)
        .subscribe((response: any) => {
            this.loginFunc(response, response['nickname'], true)
        })
    }

    logout(){
        this.mySelf = null;
        this.isAuth = false;
        this.userId = null;
        this.authStatusSubject.next(false);
        this.token = null;
        this.router.navigate(['/signin']);
        
        localStorage.removeItem('tokenData')
        localStorage.removeItem('expDate')
    }

    

    addFriend(userId: string, deleteTheirReq: boolean){
        this.http.put('https://socialmedia.up.railway.app/users/addFriend', { userId: userId, deleteTheirReq: deleteTheirReq })
        .subscribe((data: any) => {
            if(data?.sendNot == true){
                this.messageService.sendNotification(userId)
            }
            this.addFriendSubject.next(data)
        })
    }

    changeProfPic(PROFILEPIC: string){
        this.mySelf.profilePic = PROFILEPIC
        this.profPicSubject.next(this.mySelf?.profilePic)
    }

    getProfPic(){
        return this.profPicSubject.asObservable()
    }

    findFriends(){  
        this.http.get('https://socialmedia.up.railway.app/users/getMyFriends' + '?type=friends')
        .subscribe((friends:any) => {
            this.friendsSubject.next(friends.users.slice());
        })
    }

    findContacts(){
        this.http.get('https://socialmedia.up.railway.app/users/getMyFriends' + '?type=connections')
        .subscribe((contacts:any) => {
            this.contactsSubject.next(contacts.users.slice());
        })
    } 
    
    saveProfilePic(formData: object){
        this.http.put('https://socialmedia.up.railway.app/users/profilePic', formData)
        .subscribe(data => {
        }, error => {
            console.log(error)
        })
    }
    saveCoverPic(formData: object){
        this.http.put('https://socialmedia.up.railway.app/users/coverPic', formData)
        .subscribe(data => {
        }, error => {
            console.log(error)
        })
    }
}
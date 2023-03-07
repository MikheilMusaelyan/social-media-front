import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Location } from "@angular/common";
import { LoadingServiceService } from "./loading-service.service";
import { MessageService } from "./message.service";

@Injectable({
    providedIn: 'root'
})

export class CommentService {
    commentSubject: Subject<object> = new Subject();
    commentsChanged: Subject<any> = new Subject();
    commentsAmount: number = 0;
    incAmount: number = 10;

    constructor(
        private http: HttpClient,
        private location: Location,
        private loadingService: LoadingServiceService,
        private messageService: MessageService
    ){
    }
    
    getPostComments(id: string, amount: number, increasingAmount: number){
        this.commentsAmount = amount;
        const pageParams = `?postId=${id}&amount=${amount}&increasingAmount=${increasingAmount}`
        this.http.get('https://socialmedia.up.railway.app/posts/singlePost' + pageParams)
        .subscribe((postComments:any) => {
            this.commentSubject.next(postComments.postCommentsC);
        })
    };

    // paginateReplies(id: string){
    //     console.log('i thought i have to delete this one, if this occurs in console')
    //     this.http.get('https://socialmedia.up.railway.app/posts/paginatingReplies/' + id)
    //     .subscribe((postComments:any) => {
    //         console.log(postComments)
    //     })
    // }

    addComment(comment:string, image:File, replies:any[], postId:string){
        this.loadingService.startLoading(true)
        let fReader = new FormData();
        fReader.append('image', image);
        fReader.append('comment', comment);
        fReader.append('replies', JSON.stringify(replies));

        this.http.post('https://socialmedia.up.railway.app/posts/comment/' + postId, fReader)
        .subscribe((data : any) => {
            console.log(data)
            this.loadingService.startLoading(false);
            this.commentsChanged.next({ change: 'addedComment', data: data })
            if(data?.sendNot){
                this.messageService.sendNotification(data.sendNot)
            }
        }, err => {this.loadingService.startLoading(false)})
    };

    addReply(
        getCommentValue:object, postId:string, commentId:string, 
        cIndex:number, creatorId: string
    ){
        this.loadingService.startLoading(true)
        let fReader = new FormData();
        fReader.append('image', getCommentValue['image']);
        fReader.append('comment', getCommentValue['comment']);
        fReader.append('creatorId', creatorId)

        const pageParams = `?postId=${postId}&commentId=${commentId}`;
        this.http.post(
        'https://socialmedia.up.railway.app/posts/reply' + pageParams, fReader)
        .subscribe((data: any) => {
            this.loadingService.startLoading(false)
            this.commentsChanged.next({ change: 'addedReply', data: data, cIndex: cIndex});
            
            if(data?.sendNot){
                this.messageService.sendNotification(data.sendNot)
            }
        }, err => {this.loadingService.startLoading(false)})
    };

    onDeleteComment(idObject: object, commentIndex: number){
        this.loadingService.startLoading(true)
        this.http.put('https://socialmedia.up.railway.app/posts/delete-comment', idObject)
        .subscribe((data:any) => {
            this.loadingService.startLoading(false)
            this.commentsChanged.next({ change: 'deletedComment', cIndex: commentIndex })
        }, err => {this.loadingService.startLoading(false)})
    }

    onDeleteReply(idObject:object, commentIndex:number, replyIndex:number){
        this.loadingService.startLoading(true)
        this.http.put('https://socialmedia.up.railway.app/posts/delete-reply', idObject)
        .subscribe((data:any) => {
            this.loadingService.startLoading(false)
            this.commentsChanged.next({
                change: 'deletedReply',
                cIndex: commentIndex,
                rIndex: replyIndex
            })
        }, err => {this.loadingService.startLoading(false)})
    }

    editReply(replyObject: any, commentId: string, replyId: string){
        this.loadingService.startLoading(true)
        const pageParams = `?commentId=${commentId}&replyId=${replyId}`
        this.http.put('https://socialmedia.up.railway.app/posts/replyEdit' + pageParams, replyObject)
        .subscribe(data=>{
            this.loadingService.startLoading(false)
            this.location.back();
        }, err => {this.loadingService.startLoading(false)})
    }

    editComment(commentObject: any, commentId: string){
        this.loadingService.startLoading(true)
        const pageParams = `?commentId=${commentId}`
        this.http.put('https://socialmedia.up.railway.app/posts/commentEdit' + pageParams, commentObject)
        .subscribe(data => {
            this.loadingService.startLoading(false)
            this.location.back();
        }, err => {this.loadingService.startLoading(false)})
    }

    getMoreReplies(replyPosition: number){
        return this.http.get("https://socialmedia.up.railway.app/users/getReplies" + replyPosition)
    }
}

import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ErrorService } from "./error.service";
import { LoadingServiceService } from "./loading-service.service";

@Injectable({
    providedIn: 'root'
})
export class PostService{
    constructor(
        private http: HttpClient, 
        private location: Location,
        private error: ErrorService,
        private loadingService: LoadingServiceService
    ){}

    openImgSubject: Subject<any> = new Subject();
    postAddedSubject: Subject<any> = new Subject();
    myAccSubject: Subject<any> = new Subject();
    
    returnToScroll: number = 0;
    postLoading: boolean = false;

    // updatePostCount(){
    //     this.postCount += 8
    // }

    getUsersPosts(userId: string, postCount: number){
        let query = `?id=${userId}&incAmount=${postCount}`;
        return this.http.get<{posts: any[], postCount: number}>(
        'https://socialmedia.up.railway.app/users/usersPosts' + query
        ) 
    }
    
    getPosts(incAmount: number){
        return this.http.get<{posts:any[]}>(
        'https://socialmedia.up.railway.app/posts/allPosts/' + incAmount
        )
    }
    getPostAddInfo(){
        return this.postAddedSubject.asObservable();
    }
    
    addPost(postText: string, image: File, comments: any[], likes: string){
        if(this.postLoading){
            return
        }
        this.postLoading = true;
        this.loadingService.startLoading(true)
        // build formdata
        const fixedPost = new FormData();
        fixedPost.append('image', image);
        fixedPost.append('post', postText);
        fixedPost.append('comments', JSON.stringify(comments));
        fixedPost.append('likes', likes)
        // send request
        this.http.post<{data:any[]}>('https://socialmedia.up.railway.app/posts', fixedPost)
        .subscribe(data => {
            this.loadingService.startLoading(false)
            this.postLoading = false;
            // sned subject
            this.postAddedSubject.next({
                change: 'addedPost',
                post: data.data
            })
        })
    };

    onEdit(editedForm: object){
        if(this.postLoading){
            return
        }
        this.postLoading = true;
        this.http.put('https://socialmedia.up.railway.app/posts/edit', editedForm)
        .subscribe((data:any) => {
            this.postLoading = false;
            this.location.back();
        })
    };
    
    onDelete(id: string, indexFront: number, mode?: string){
        if(this.postLoading){
            return
        }
        this.postLoading = true;
        this.loadingService.startLoading(true)
        this.http.delete('https://socialmedia.up.railway.app/posts/delete/' + id).subscribe((deleted: any) => {
            this.postLoading = false;
            this.loadingService.startLoading(false)
            if(deleted.response.deletedCount >= 1){ 
                this.postAddedSubject.next
                ({change: 'deletedPost', id: id})
            } else {
                this.error.throwError('Could not delete post')
            }
        })
    };

    saveScroll(saveScroll: number){
        this.returnToScroll = saveScroll;
    }
    
    getScroll(){
        return this.returnToScroll
    }

    onOpenImg(pickedImg: string){
        if(!pickedImg || pickedImg?.length <= 1){
            return
        } else if(pickedImg.length > 0){
            this.openImgSubject.next(pickedImg) 
        }
    }

    accOpened(bool: boolean){
        this.myAccSubject.next(bool)
    }

    // onPostLike(postId:string, creatorId:string){
    //     const idObject = {
    //         postId: postId,
    //         creatorId: creatorId
    //     }
    //     this.http.post('https://socialmedia.up.railway.app/posts/likePost', idObject)
    //     .subscribe(data => {
    //         console.log(data)
    //     })
    // }
}

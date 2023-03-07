import { Directive, ElementRef, HostListener, Injectable } from "@angular/core";
import { PostService } from "../services/post.service";

@Directive({
    selector: '[openImg]'
})
export class openImageDirective{
    constructor(
        private elRef:ElementRef, 
        private postService:PostService
    ){
    }
    @HostListener('click') openImage(){
        this.postService.onOpenImg(this.elRef.nativeElement.src)
    }
}
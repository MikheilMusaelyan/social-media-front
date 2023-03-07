import { Directive, ElementRef } from "@angular/core";
import { HostListener, HostBinding } from "@angular/core";
@Directive({
    selector: '[getPosts]'
})
export class FooterDirective{
    constructor(private elRef:ElementRef){
        
    }
    @HostListener('window:onload', []) onWindowScroll(){
        
    }
}
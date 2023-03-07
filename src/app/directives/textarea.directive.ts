import { Directive, ElementRef, HostListener, Renderer2 } from "@angular/core";

@Directive({
    selector: '[incHeight]'
})
export class TextAreaDirective{
    constructor(private elRef:ElementRef, private renderer:Renderer2 ){}
    textValue = null;
    @HostListener('input') changeHeight(){
        this.elRef.nativeElement.value = this.elRef.nativeElement.value.substring(0,1000)
        this.renderer.setStyle(this.elRef.nativeElement, "height", "");
        this.renderer.setStyle(
            this.elRef.nativeElement, 
            "height", 
            this.elRef.nativeElement.scrollHeight + "px"
        );
    };
}
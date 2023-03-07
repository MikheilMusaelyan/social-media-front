import { Directive, ElementRef } from "@angular/core";

@Directive({
    selector: '[navigate]'
})
export class navigateDirective{
    constructor(private elRef:ElementRef){
    }
}
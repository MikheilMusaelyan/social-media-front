import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    intercept(req:HttpRequest<any>, next: HttpHandler){
        return next.handle(req).pipe(
            catchError((err:HttpErrorResponse) => {
                let errMsg = 'There is an unknown error'
                if(err.error.message){
                    errMsg = err.error.message
                }
                return throwError(errMsg)
            })
        )
    }
}
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { authService } from "./services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService:authService){}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = this.authService.returnToken();
        const header = req.clone({
            headers: req.headers.set('auth', "Bearer " + token)
            
        })

        return next.handle(header)
    }
}
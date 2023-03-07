import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { authService } from "./services/auth.service";

@Injectable()

export class AuthGuard implements CanActivate{
    constructor(private authService: authService, private router:Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean> | Promise<boolean> | boolean {
        const status = this.authService.getIsAuth();
        if(!status){
            this.router.navigate(['/signin'])
        }
        return status
    }
}   
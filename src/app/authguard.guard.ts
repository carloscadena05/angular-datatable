import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from "@angular/router";
import { UsersService } from "./services/users.service";

@Injectable({
  providedIn: 'root',
})
export class AuthguardGuard implements CanActivate {
  constructor (private service: UsersService,
    private router: Router){}
      canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): boolean {
        const routeUrl: string = state.url;
        return this.isLogin(routeUrl)!;
      }

      isLogin(routeUrl: string) {
        if ( this.service.isLoggedIn()){
          return true;
        }

        this.service.redirectUrl = routeUrl;
        this.router.navigate(['/login'], { queryParams: { returnUrl: routeUrl}});
      }

}

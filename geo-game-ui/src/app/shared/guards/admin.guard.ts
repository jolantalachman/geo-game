import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '@shared/services';
import { UserFacade } from '@shared/store/user';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {

  constructor(private facade: UserFacade, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.facade.isAdmin) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}

import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { UserState } from "./user.state";
import { UserService } from "@shared/services";
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { map, switchMap, tap } from "rxjs";
import { UserActions } from "./user.actions";
import { UserSelectors } from "./user.selectors";
import { UserRoleEnum } from "@shared/enum";
import { GameStatsModel, LoginResponseModel } from "@shared/models";
import { Sort } from "@angular/material/sort";

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  private store = inject(Store<UserState>);
  private service = inject(UserService);
  private authService = inject(SocialAuthService);

  get isAdmin() {
    return (this.service.getRole() === UserRoleEnum.ADMIN);
  }

  get isAuthenticated() {
    return !!this.service.getToken();
  }
  get token() {
    return this.service.getToken();
  }

  role$ = this.store.select(UserSelectors.selectRole);

  scoreChart$ = this.getUserScoreChart();

  login() {
    return this.authService.authState.pipe(
      switchMap((user) => {
        return this.service.login(user.idToken).pipe(
          tap((response) => {
            this.handleLoginSuccess(response, user);
          }),
        );
      })
    );
  }

  public getRole() {
    return this.service.getUserRole().pipe(
      map((x) => this.mapRole(x.role)),
      tap(x => 
        this.store.dispatch(UserActions.setRole({ role: x }))
      )
    );
  }

  public getUserInfo() {
    return this.service.getUserInfo();
  }

  public getUserScoreChart() {
    return this.service.getUserScoreChart();
  }

  public getUserScores(pageIndex: number, pageSize: number, sort: Sort) {
    return this.service.getUserScores(pageIndex, pageSize, sort);
  }

  public deleteUserScores() {
    return this.service.deleteUserScores();
  }

  public deleteUserAccount() {
    return this.service.deleteUserAccount();
  }

  public saveScore(gameStats: GameStatsModel) {
    return this.service.saveScore(gameStats);
  }

  public saveNick(nick: string) {
    return this.service.saveNick(nick);
  }

  private mapRole(role: string | null): UserRoleEnum | null {
    if(role) {
      return role === 'Admin' ? UserRoleEnum.ADMIN : UserRoleEnum.USER;
    }
    else {
      return null;
    }
  }


  private handleLoginSuccess(response: LoginResponseModel, user: SocialUser) {
    this.service.setToken(response.token);
    this.service.setRole(this.mapRole(response.role));
    this.store.dispatch(UserActions.setRole({ role: this.mapRole(response.role) }));
  }

  logout() {
    this.service.removeStorage();
    window.location.reload();
  }
}

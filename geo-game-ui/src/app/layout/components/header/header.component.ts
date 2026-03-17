import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { UserRoleEnum } from '@shared/enum';
import { UserService } from '@shared/services';
import { UserFacade } from '@shared/store/user';
import { tap } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    standalone: false
})
export class HeaderComponent {
  private facade = inject(UserFacade);
  public UserRoleEnum = UserRoleEnum;
  public googleClientId = environment.googleClientId;
  role$ = this.facade.role$;

  constructor(private router: Router){}
  
  goTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.facade.logout();
  }
}

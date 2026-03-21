import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { faUser, faCogs, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { UserRoleEnum } from '@shared/enum';
import { DeviceService} from '@shared/services';
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

  public readonly icons = {
    faUser,
    faCogs,
    faRightFromBracket
  };

  constructor(private router: Router, public device: DeviceService){}
  
  goTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.facade.logout();
  }
}

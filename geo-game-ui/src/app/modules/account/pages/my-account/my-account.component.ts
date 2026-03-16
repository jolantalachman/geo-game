import { AfterViewInit, Component, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { faCheck, faPen, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { UserRoleEnum } from '@shared/enum';
import { ScoreApiModel } from '@shared/models';
import { UserFacade } from '@shared/store/user';
import { BehaviorSubject, combineLatest, map, of, switchMap, tap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent implements AfterViewInit {
  private facade = inject(UserFacade);
  refresh = new BehaviorSubject<boolean>(false);
  refresh$ = this.refresh.asObservable();
  user$ = this.refresh$.pipe(
    switchMap(() => this.facade.getUserInfo()),
    tap((user) => {
      this.nickInput = user.nick;
    })
  );
  scoreChart$ = this.facade.scoreChart$;
  displayedColumns: string[] = ['gameDate', 'gameTime', 'guessedCountries'];
  dataSource = new MatTableDataSource<ScoreApiModel>([]);
  public UserRoleEnum = UserRoleEnum;
  icons = {faTrash, faPen, faPlus, faXmark, faCheck};
  showConfirmationDeleteUserDialog = false;
  showConfirmationDeleteScoresDialog = false;
  editNick = false;
  nickInput = '';

  pageIndex = 0;
  pageSize = 5;
  totalItems = 0;
  sortOptions: Sort = {
    active: '',
    direction: '',
  }

  ngAfterViewInit() {
    this.loadPageData().subscribe();
  }

  loadPageData() {
    return this.facade.getUserScores(this.pageIndex, this.pageSize, this.sortOptions).pipe(
      tap((scores) => {
        this.dataSource.data = scores.data;
        this.totalItems = scores.totalCount;
      })
    );
  }

  mapDate(dateString: string) {
    return new Date(dateString);
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadPageData().subscribe();
  }

  handleSort(event: Sort) {
    this.sortOptions = event;
    this.loadPageData().subscribe();
  }

  onCancelDeleteUserDialog() {
    this.showConfirmationDeleteUserDialog = false;
  }

  onContinueDeleteUserDialog() {
    this.facade.deleteUserAccount().subscribe(() => {
      this.showConfirmationDeleteUserDialog = false;
      this.facade.logout();
    });
  }

  onCancelDeleteScoresDialog() {
    this.showConfirmationDeleteScoresDialog = false;
  }

  onContinueDeleteScoresDialog() {
    this.facade.deleteUserScores().pipe(
      switchMap(() => 
        this.loadPageData()
      ),
      tap(() => {
        this.scoreChart$ = of(null);
        this.scoreChart$ = this.facade.getUserScoreChart();
      })
    ).subscribe(() => 
      this.showConfirmationDeleteScoresDialog = false
    );
  }

  deleteScoreHistory() {
    this.showConfirmationDeleteScoresDialog = true;
  }

  deleteAccount() {
    this.showConfirmationDeleteUserDialog = true;
  }

  changeNickState(state: boolean) {
    this.editNick = state;
  }

  saveNick() {
    this.facade.saveNick(this.nickInput).pipe(tap(x => {
      this.changeNickState(false);
      this.refresh.next(x);
    })).subscribe();
  }
}

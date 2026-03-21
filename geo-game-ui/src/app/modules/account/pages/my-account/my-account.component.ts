import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { faCheck, faPen, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { UserRoleEnum } from '@shared/enum';
import { ScoreApiModel, ScoreChartModel } from '@shared/models';
import { DeviceService } from '@shared/services';
import { UserFacade } from '@shared/store/user';
import { BehaviorSubject, Observable, of, Subject, switchMap, take, takeUntil, tap} from 'rxjs';

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html',
    styleUrl: './my-account.component.scss',
    standalone: false
})
export class MyAccountComponent implements AfterViewInit, OnDestroy {
  private facade = inject(UserFacade);
  public isMobile$ = inject(DeviceService).isMobile$;
  private readonly destroy$ = new Subject<void>();
  refresh = new BehaviorSubject<boolean>(false);
  refresh$ = this.refresh.asObservable();
  user$ = this.refresh$.pipe(
    switchMap(() => this.facade.getUserInfo()),
    tap((user) => {
      this.nickInput = user.nick ?? '';
    })
  );
  scoreChart$: Observable<ScoreChartModel | null> = this.facade.scoreChart$;
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
    this.loadPageData().pipe(takeUntil(this.destroy$)).subscribe();
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
    this.loadPageData().pipe(take(1)).subscribe();
  }

  handleSort(event: Sort) {
    this.sortOptions = event;
    this.loadPageData().pipe(take(1)).subscribe();
  }

  onCancelDeleteUserDialog() {
    this.showConfirmationDeleteUserDialog = false;
  }

  onContinueDeleteUserDialog() {
    this.facade.deleteUserAccount().pipe(take(1)).subscribe(() => {
      this.showConfirmationDeleteUserDialog = false;
      this.facade.logout();
    });
  }

  onCancelDeleteScoresDialog() {
    this.showConfirmationDeleteScoresDialog = false;
  }

  onContinueDeleteScoresDialog() {
    this.facade.deleteUserScores().pipe(
      take(1),
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
    this.facade.saveNick(this.nickInput).pipe(
      take(1),
      tap((x) => {
        this.changeNickState(false);
        this.refresh.next(x);
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

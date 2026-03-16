import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserRoleEnum } from '@shared/enum';
import { UsersApiModel } from '@shared/models';
import { AdminFacade } from '@shared/store/activity';
import { LoggerService } from '@shared/services';
import { catchError, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
    standalone: false
})
export class UsersComponent implements AfterViewInit, OnDestroy {
  private facade = inject(AdminFacade);
  private logger = inject(LoggerService);
  private readonly destroy$ = new Subject<void>();
  dataSource = new MatTableDataSource<UsersApiModel>([]);
  displayedColumns: string[] = ['email', 'role', 'lastActivity', 'actions'];
  pageIndex = 0;
  pageSize = 5;
  totalItems = 0;
  sortOptions: Sort = {
    active: '',
    direction: '',
  }
  faTrash = faTrash;
  userRoleEnum = UserRoleEnum;

  ngAfterViewInit() {
    this.loadPageData().pipe(takeUntil(this.destroy$)).subscribe();
  }

  mapDate(dateString: string) {
    return new Date(dateString);
  }

  handleSort(event: Sort) {
    this.sortOptions = event;
    this.loadPageData().subscribe();
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadPageData().subscribe();
  }

  loadPageData() {
    return this.facade.getUsers(this.pageIndex, this.pageSize, this.sortOptions).pipe(
      tap((activities) => {
        this.dataSource.data = activities.data;
        this.totalItems = activities.totalCount;
      })
    );
  }

  deleteAccount(id: number) {
    this.facade.deleteUser(id).pipe(
      take(1),
      switchMap(() => this.loadPageData()),  // Once the user is deleted, load the data again
      catchError((error) => {
        this.logger.error('Error during delete or loading data:', error);
        return of(null);  // Return a default value or handle the error accordingly
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

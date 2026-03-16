import { AfterViewInit, Component, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivityApiModel } from '@shared/models';
import { AdminFacade } from '@shared/store/activity';
import { tap } from 'rxjs';

@Component({
    selector: 'app-activity-log',
    templateUrl: './activity-log.component.html',
    styleUrl: './activity-log.component.scss',
    standalone: false
})
export class ActivityLogComponent implements AfterViewInit {
  private facade = inject(AdminFacade);
  dataSource = new MatTableDataSource<ActivityApiModel>([]);
  displayedColumns: string[] = ['activityDateTime', 'activityType', 'user'];
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
    return this.facade.getActivities(this.pageIndex, this.pageSize, this.sortOptions).pipe(
      tap((activities) => {
        this.dataSource.data = activities.data;
        this.totalItems = activities.totalCount;
      })
    );
  }
}

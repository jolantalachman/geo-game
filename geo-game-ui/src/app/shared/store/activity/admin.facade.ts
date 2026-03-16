import { inject, Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { AdminService } from "@shared/services";

@Injectable({
  providedIn: 'root',
})
export class AdminFacade {
  private service = inject(AdminService);

  public getActivities(pageIndex: number, pageSize: number, sort: Sort) {
    return this.service.getActivities(pageIndex, pageSize, sort);
  }

  public getUsers(pageIndex: number, pageSize: number, sort: Sort) {
    return this.service.getUsers(pageIndex, pageSize, sort);
  }

  public deleteUser(id: number) {
    return this.service.deleteUser(id);
  }
}
